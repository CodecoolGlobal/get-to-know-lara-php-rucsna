<?php

namespace App\Services;

use App\Http\Requests\DraftRequest;
use App\Http\Requests\SendMailRequest;
use App\Models\Mail;
use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\UnauthorizedException;
use Spatie\FlareClient\Http\Exceptions\NotFound;

class MailService
{
    /**
     * @throws Exception
     */
    public function getMailsFromUser($userId)
    {
        $user = User::query()->find($userId);
        $mails = $user->sentMails()->get();

        return $mails->map(function ($mail) {
            return [
                'id' => $mail->id,
                'name' => $mail->user_to->name,
                'email' => $mail->user_to->email,
                'subject' => $mail->subject,
                'reply_to' => $mail->reply_to,
                'attachment' => $mail->attachment,
                'time' => $mail->pivot->sent_at,
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }

    public function getMailsToUser($userId)
    {
        $user = User::query()->find($userId);
        $mails = $user->receivedMails()->get();

        return $mails->map(function ($mail) {
            return [
                'id' => $mail->id,
                'name' => $mail->user_from->name,
                'email' => $mail->user_from->email,
                'subject' => $mail->subject,
                'reply_to' => $mail->reply_to,
                'attachment' => $mail->attachment,
                'time' => $mail->pivot->received_at,
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }

    public function getDraftsByUser($userId)
    {
        $user = User::query()->find($userId);
        $mails = $user->drafts()->get();

        return $mails->map(function ($mail) {
            return [
                'id' => $mail->id,
                'name' => $mail->user_to->name ?? '(No address)',
                'email' => $mail->user_to->email ?? '(No address)',
                'subject' => $mail->subject,
                'reply_to' => $mail->reply_to,
                'attachment' => $mail->attachment,
                'time' => $mail->created_at,
                'opened_at' => $mail->created_at
            ];
        });
    }

    public function createDraft(DraftRequest $request)
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
            return $newDraft;
        });

    }

    public function sendNewMail(SendMailRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $allowedFields = $request->allowed();

            $newMail = Mail::query()->create($allowedFields);

            Transaction::query()->create([
                'user_id' => $allowedFields['user_id_from'],
                'mail_id' => $newMail->id,
                'sent_at' => now(),
                'opened_at' => now()
            ]);

            Transaction::query()->create([
                'user_id' => $allowedFields['user_id_to'],
                'mail_id' => $newMail->id,
                'received_at' => now()
            ]);
            //$this->createTransactions($allowedFields['user_id_from'], $allowedFields['user_id_to'], $newMail->id);
            return $newMail;
        });
    }

    public function sendUpdatedMail($mailId, SendMailRequest $request)
    {
        return DB::transaction(function () use ($mailId, $request) {
            $allowedFields = $request->allowed();

            $mailToUpdate = Mail::query()->find($mailId);
            $mailToUpdate->update($allowedFields);

            $fromTransaction = $mailToUpdate->transactions()
                ->where('mail_id', $mailId)
                ->where('user_id', $allowedFields['user_id_from'])
                ->first();
            $fromTransaction->update(['sent_at' => now()]);

            $toTransaction = $mailToUpdate->transactions()
                ->where('mail_id', $mailId)
                ->where('user_id', $allowedFields['user_id_to'])
                ->first();
            if ($toTransaction) {
                $toTransaction->update(['received_at' => now()]);
            } else {
                Transaction::query()->create([
                    'user_id' => $allowedFields['user_id_to'],
                    'mail_id' => $mailToUpdate->id,
                    'received_at' => now()
                ]);
            }
            //$this->createTransactions($allowedFields['user_id_from'], $allowedFields['user_id_to'], $mailToUpdate->id);
            return $mailToUpdate;
        });
    }

    /**
     * @throws Exception
     */
    public function displayMail($request): Model|Collection|Builder|array|null
    {
        $displayTransaction = Transaction::query()
            ->where('user_id', $request['user_id'])
            ->where('mail_id', $request['mail_id'])
            ->first();
        if (!$displayTransaction) {
            throw new UnauthorizedException('Cannot access this content');
        }

        if ($displayTransaction->whereNull('opened_at')->exists()) {
            $displayTransaction->update(['opened_at' => now()]);
        }
        $displayTransaction->refresh();
        $userFrom = $displayTransaction->mail->user_from()->first();
        $userTo = $displayTransaction->mail->user_to()->first();
        if(!$userTo){
            throw new NotFound('No mail available');
        }

        return
            [
                'mail_id' => $displayTransaction->mail_id,
                'subject' => $displayTransaction->mail->subject,
                'message' => $displayTransaction->mail->message,
                'reply_to' => $displayTransaction->mail->reply_to,
                'attachment' => $displayTransaction->mail->attachment,
                'sent' => $displayTransaction->sent_at,
                'received' => $displayTransaction->received_at,
                'opened_at' => $displayTransaction->opened_at,
                'user_to_name' => $userTo->name,
                'user_to_email' => $userTo->email,
                'user_from_name' => $userFrom->name,
                'user_from_email' => $userFrom->email
            ];
    }

    /**
     * @throws Exception
     */
    public function deleteMail($request): Model|Collection|Builder|array|null
    {
        $deleteTransaction = Transaction::query()
            ->where('user_id', $request['user_id'])
            ->where('mail_id', $request['mail_id'])
            ->first();
        if (!$deleteTransaction) {
            throw new UnauthorizedException('Cannot access this content');
        }
        if ($deleteTransaction->deleted_at != null){
            throw new Exception('Mail is already deleted');
        }

        if($deleteTransaction->deleted_at === null) {
            $deleteTransaction->update(['deleted_at' => now()]);
        }
        $deleteTransaction->refresh();

        return $deleteTransaction->mail()->first();
    }

    /**
     * @throws Exception
     */
    public function getDeletedMails($userId)
    {
        $user = User::query()->find($userId);
        $mails = $user->deletedMails()->get();

        return $mails->map(function ($mail) {
            return [
                'id' => $mail->id,
                'name' => $mail->user_to->name ?? '(No address)',
                'email' => $mail->user_to->email ?? '(No address)',
                'subject' => $mail->subject,
                'reply_to' => $mail->reply_to,
                'attachment' => $mail->attachment,
                'time' => $mail->pivot_deleted_at,
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }

    /**
     * @throws Exception
     */
    public function restoreMail($request)
    {
        $user = User::query()->find($request['user_id']);
        $mailToRestore = $user->mails->where('id', $request['mail_id'])->first();
        if (!$mailToRestore) {
            throw new UnauthorizedException('Cannot access this content');
        }

        if ($request['type'] == 'deleted' &&
            $mailToRestore->transactions()->where('user_id', $request['user_id'])->whereNull('deleted_at')->exists()) {
            throw new Exception('Mail is not deleted');
        }

        if ($request['type'] === 'deleted') {
            $field = 'deleted_at';
        } elseif ($request['type'] === 'read') {
            $field = 'opened_at';
        } else {
            throw new Exception('Invalid operation');
        }

        $mailToRestore->transactions()
            ->where('user_id', $request['user_id'])
            ->whereNotNull($field)
            ->update(["{$field}" => null]);

        return $mailToRestore;
    }

    /**
     * @throws Exception
     */
    public function deleteDraft($mailId, $userId): void
    {
        $draftToDelete = Mail::query()->where('user_id_from', $userId)->where('is_draft', true)->find($mailId);
        if (!$draftToDelete) {
            throw new Exception('Not a draft');
        }
        $draftToDelete->transactions()->delete();

        $draftToDelete->delete();
    }

    public function displayDraft($request): array
    {
        $user = User::query()->find($request['user_id']);
        $draft = $user->drafts()->where('mail_id', $request['mail_id'])->first();

        $user_to = null;
        $draftTransaction = $draft->transactions()->where('user_id', '!=', $request['user_id'])->first();
        if($draftTransaction){
            $user_to = $draftTransaction->user()->first();
        }

        return [
            'id' => $draft->id,
            'user_id_from' => $request['user_id'],
            'user_id_to' => $user_to ? $user_to->id : null,
            'name' => $user_to ? $user_to->name : '',
            'email' => $user_to ? $user_to->email : '',
            'subject' => $draft->subject,
            'message' => $draft->message
        ];
    }
}
