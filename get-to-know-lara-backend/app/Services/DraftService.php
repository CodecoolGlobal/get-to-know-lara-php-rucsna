<?php

namespace App\Services;

use App\Http\Requests\DraftRequest;
use App\Http\Requests\TransactionUpdateRequest;
use App\Models\Mail;
use App\Models\Transaction;
use App\Models\User;
use App\Trait\HandlesAttachments;
use Exception;
use Illuminate\Support\Facades\DB;

class DraftService
{
    use HandlesAttachments;

    /**
     * Get user's drafts if any.
     * Display a listing of the drafts' data with receiver name and address if it is already set.
     * Display the number of the attachment's if there is any.
     *
     * @param string $userId
     * @return mixed
     * @throws Exception
     */
    public function getDraftsByUser(string $userId): mixed
    {
        $user = User::query()->find($userId);
        if (!$user) throw new Exception('User not found');

        $mails = $user->drafts()->get();
        return $mails->map(function ($mail) {
            $userTo = $mail->user_to()->first();

            return [
                'id' => $mail->id,
                'name' => $userTo->name ?? '',
                'email' => $userTo->email ?? '',
                'subject' => $mail->subject,
                'message' => $mail->message,
                'reply_to' => $mail->reply_to,
                'attachment_counter' => $mail->attachments()->count(),
                'time' => $mail->created_at,
                'opened_at' => $mail->created_at
            ];
        });
    }


    /**
     * Save a new mail object from the form request.
     * Create a transaction object for the sender, and if exists one for the receiver.
     * Use HandlesAttachments trait to save attachment files.
     *
     * @param DraftRequest $request
     * @return mixed
     */
    public function createDraft(DraftRequest $request): mixed
    {
        return DB::transaction(function () use ($request) {
            $allowedFields = $request->allowed();
            $newDraft = Mail::query()->create($allowedFields);

            Transaction::query()->create([
                'user_id' => $allowedFields['user_id_from'],
                'mail_id' => $newDraft->id,
                'opened_at' => now()
            ]);
            if ($allowedFields['user_id_to']) {
                Transaction::query()->create([
                    'user_id' => $allowedFields['user_id_to'],
                    'mail_id' => $newDraft->id
                ]);
            }

            $draftId = $newDraft->id;
            $this->handleAttachments($request, $draftId);

            return $newDraft;
        });
    }


    /**
     * Update an existing draft from the form request.
     * Check the transactions related to the draft, no modification for sender's transaction.
     * Check the recipient's transaction. If exists check for recipient changes, update the transaction accordingly.
     * Create new recipient transaction if a recipient id comes from the request.
     * Use HandlesAttachments trait to save attachment files.
     *
     * @param string $mailId
     * @param DraftRequest $request
     * @return mixed
     */
    public function updateDraft(string $mailId, DraftRequest $request): mixed
    {
        return DB::transaction(function () use ($mailId, $request) {
            $allowedFields = $request->allowed();

            $draftToUpdate = Mail::query()->find($mailId);
            $draftToUpdate->update($allowedFields);

            $draftTransaction = $draftToUpdate->transactions()->where('user_id', '!=', $request['user_id_from'])->first();
            if (isset($allowedFields['user_id_to'])) {
                if ($draftTransaction) {
                    if ($draftTransaction->user_id !== $allowedFields['user_id_to']) {
                        $draftTransaction->update(['user_id' => $allowedFields['user_id_to']]);
                    }
                } else {
                    Transaction::query()->create([
                        'user_id' => $allowedFields['user_id_to'],
                        'mail_id' => $draftToUpdate->id
                    ]);
                }
            }

            $this->handleAttachments($request, $mailId);

            return $draftToUpdate;
        });
    }


    /**
     * Display a draft by user id and mail id.
     * Return mail data, attachments, username and address.
     *
     * @param TransactionUpdateRequest $request
     * @return array
     */
    public function displayDraft(TransactionUpdateRequest $request): array
    {
        $user = User::query()->find($request['user_id']);
        $draft = $user->drafts()->with(['attachments', 'transactions' => function ($query) use ($request) {
                $query->where('user_id', '!=', $request['user_id']);
            }])->where('mail_id', $request['mail_id'])->first();

        $draftTransaction = $draft->transactions->first();
        $user_to = $draftTransaction ? $draftTransaction->user()->first() : null;

        $fileNames = $draft->attachments->pluck('filename')->toArray();

        return [
            'id' => $draft->id,
            'user_id_from' => $request['user_id'],
            'user_id_to' => $user_to->id ?? null,
            'name' => $user_to->name ?? '',
            'email' => $user_to->email ?? '',
            'subject' => $draft->subject,
            'message' => $draft->message,
            'attachment' => $fileNames,
        ];
    }


    /**
     * Delete a specified draft related to a user.
     * Delete the draft's transaction(s) together.
     *
     * @param string $mailId
     * @param string $userId
     * @return void
     * @throws Exception
     */
    public
    function deleteDraft(string $mailId, string $userId): void
    {
        $user = User::query()->find($userId);
        if (!$user) throw new Exception('User not found');

        $draftToDelete = $user->drafts()->where('mail_id', $mailId)->first();
        if (!$draftToDelete) throw new Exception('Draft not found');

        DB::transaction(function () use ($draftToDelete) {
            $draftToDelete->transactions()->delete();
            $draftToDelete->delete();
        });
    }
}
