<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Mail;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;

class MailController extends Controller
{
    /**
     * Mails by user for Inbox and Sent pages.
     * Get user's name, email, mail subject, and time of sending.
     * Display a listing of the mails data the user received/sent (latest first).
     * Only those that are not deleted.
     */
    public function getMailsByUser(string $type, string $userId): JsonResponse
    {
        try {
            $user = User::query()->findOrFail($userId);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], Response::HTTP_NOT_FOUND);
            }

            $mails = $user->mails()
                ->with(['user_from', 'user_to'])
                ->whereNull('deleted_at')
                ->whereNotNull($type === 'inbox' ? 'received_at' : 'sent_at')
                ->orderByDesc($type === 'inbox' ? 'received_at' : 'sent_at')
                ->get();

            $mailsResponse = $mails->map(function ($mail) use ($type) {
                $user = $type === 'inbox' ? 'user_from' : 'user_to';
                return [
                    $user . '_name' => $mail->{$user}->name,
                    $user . '_email' => $mail->{$user}->email,
                    'subject' => $mail->subject,
                    'time' => $mail->pivot->{$type === 'inbox' ? 'received_at' : 'sent_at'},
                    'opened_at' => $mail->pivot->opened_at
                ];
            });
            return response()->json([
                'success' => true,
                'mails' => $mailsResponse
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return \response()->json([
                'success' => false,
                'message' => 'Error fetching mails' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Store a newly created mail as a draft.
     * The mail is not sent yet, receiver, subject, message, attachment, reply_to all optional fields.
     */
    public function createDraft(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'from' => 'required|exists:users,id',
            'to' => 'sometimes|nullable|exists:users,id',
            'reply_to' => 'sometimes|nullable|exists:mails,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $newDraft = Mail::query()->create([
                'user_id_from' => $request['from'],
                'user_id_to' => $request['to'],
                'subject' => $request['subject'],
                'message' => $request['message'],
                'attachment' => $request['attachment'],
                'reply_to' => $request['reply_to']
            ]);
            return response()->json([
                'success' => true,
                'draft' => $newDraft
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating draft' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Store a newly created mail or update already existing draft.
     * Create 2 new transactions for sender and receiver.
     */
    public function sendMail(Request $request, ?string $mailId = null)
    {
        $validator = Validator::make($request->all(), [
            'from' => 'required|exists:users,id',
            'to' => 'required|exists:users,id',
            'reply_to' => 'sometimes|nullable|exists:mails,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($mailId === null) {
            try {
                DB::transaction(function () use ($request) {
                    $newMail = Mail::create([
                        'user_id_from' => $request['from'],
                        'user_id_to' => $request['to'],
                        'subject' => $request['subject'],
                        'message' => $request['message']
                    ]);

                    $transactionFrom = Transaction::query()->create([
                        'user_id' => $request['from'],
                        'mail_id' => $newMail->id,
                        'sent_at' => now()
                    ]);

                    $transactionTo = Transaction::query()->create([
                        'user_id' => $request['to'],
                        'mail_id' => $newMail->id,
                        'received_at' => now()
                    ]);
                    return response()->json([
                        'success' => true,
                        'mail' => $newMail,
                        'sent' => $transactionFrom,
                        'received' => $transactionTo
                    ], Response::HTTP_CREATED);
                });
            } catch (\Exception $exception) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error creating new mail or transactions' . $exception->getMessage()
                ], Response::HTTP_BAD_REQUEST);
            }
        } else {
            try {
                DB::transaction(function () use ($request, $mailId) {
                    $updatedMail = Mail::query()->find($mailId);
                    $updatedMail->update([
                        'user_id_to' => $request['to'],
                        'subject' => $request['subject'],
                        'message' => $request['message'],
                        'attachment' => $request['attachment']
                    ]);
                    $updatedMail->save();
                    $transactionFrom = Transaction::query()->create([
                        'user_id' => $request['from'],
                        'mail_id' => $mailId,
                        'sent_at' => now()
                    ]);
                    $transactionTo = Transaction::query()->create([
                        'user_id' => $request['to'],
                        'mail_id' => $mailId,
                        'received_at' => now()
                    ]);
                    return response()->json([
                        'success' => true,
                        'mail' => $updatedMail,
                        'sent' => $transactionFrom,
                        'received' => $transactionTo
                    ], Response::HTTP_OK);
                });
            } catch (\Exception $exception) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error updating mail or transactions' . $exception->getMessage()
                ], Response::HTTP_BAD_REQUEST);
            }
        }
    }

    /**
     * Display the specified mail.
     * Update the related transaction with opened_at timestamp.
     */
    public function displayMail(string $mailId): JsonResponse
    {
        $mailToDisplay = Mail::query()->find($mailId);
        if (!$mailToDisplay) {
            return response()->json([
                'success' => false,
                'message' => 'Mail not found'
            ], Response::HTTP_NOT_FOUND);
        } else {
            try {
                $mailToDisplay->transactions()
                    ->whereNotNull('received_at')
                    ->whereNull('deleted_at')
                    ->whereNull('opened_at')
                    ->update(['opened_at' => now()]);
                return response()->json([
                    'success' => true,
                    'mail' => $mailToDisplay
                ], Response::HTTP_OK);
            } catch (\Exception $exception) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error displaying mail ' . $exception->getMessage()
                ], Response::HTTP_BAD_REQUEST);
            }
        }
    }

    /**
     * Soft delete the specified mail.
     * Update the related transaction with deleted_at timestamp.
     */
    public function remove(string $mailId, string $userId): JsonResponse
    {
        $user = User::query()->find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $mailToDelete = $user->mails->where('id', $mailId)->first();
        if (!$mailToDelete) {
            return response()->json([
                'success' => false,
                'message' => 'Mail not found'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($mailToDelete->transactions()->where('user_id', $userId)->whereNotNull('deleted_at')->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Mail is already deleted'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $mailToDelete->transactions()
                ->where('user_id', $userId)
                ->whereNull('deleted_at')
                ->update(['deleted_at' => now()]);
            $mailToDelete->refresh();

            return response()->json([
                'success' => true,
                'mail' => $mailToDelete
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error removing mail ' . $exception->getMessage(),
                'mail' => $mailToDelete
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Display the user's deleted mails.
     * List data through transactions table 'deleted_at' field.
     */
    public function getDeletedMails(string $userId): JsonResponse
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ],Response::HTTP_NOT_FOUND);
        }

        try {
            $deletedMails = $user->mails()->whereNotNull('deleted_at')->orderByDesc('deleted_at')->get();

            $mails = $deletedMails->map(function ($mail) use ($userId) {
                $user = $mail->user_id_from === $userId ? 'user_from' : 'user_to';
                return [
                    $user . '_name' => $mail->{$user}->name,
                    $user . '_email' => $mail->{$user}->email,
                    'subject' => $mail->subject,
                    'time' => $mail->pivot->deleted_at
                ];
            });
            return response()->json([
                'success' => true,
                'mails' => $mails
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching mails ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Restore the user's deleted mails.
     * Set the 'deleted_at' field back to null.
     */
    public function restoreDeletedMail(string $mailId, string $userId): JsonResponse
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ],Response::HTTP_NOT_FOUND);
        }

        $mailToRestore = $user->mails->where('id', $mailId)->first();
        if (!$mailToRestore) {
            return response()->json([
                'success' => false,
                'message' => 'Mail not found'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($mailToRestore->transactions()->where('user_id', $userId)->whereNull('deleted_at')->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Mail is not deleted'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $mailToRestore->transactions()
                ->where('user_id', $userId)
                ->whereNotNull('deleted_at')
                ->update(['deleted_at' => null]);
            $mailToRestore->refresh();

            return \response()->json([
                'success' => true,
                'mail' => $mailToRestore
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error restoring mail ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Remove the specified mail from storage.
     */
    public function deleteDraft($id): JsonResponse
    {
        // check if exists
        // check if draft - with no transaction
        try {
            $deletedDraftId = Mail::destroy($id);
            return response()->json([
                'success' => true,
                'mailId' => $deletedDraftId
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting draft ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getDraftsByUser(string $userId): JsonResponse
    {
        $drafts = collect();
        try {
            $mails = Mail::query()->where('user_id_from', $userId)->get();
            $mails->each(function ($mail) use ($drafts) {
                if ($mail->transactions()->count() === 0) {
                    $drafts->push($mail);
                }
            });
            return response()->json([
                'success' => true,
                'drafts' => $drafts
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching drafts ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
