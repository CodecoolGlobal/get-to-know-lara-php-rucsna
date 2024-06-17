<?php

namespace App\Services;

use App\Http\Requests\SendMailRequest;
use App\Http\Requests\TransactionUpdateRequest;
use App\Models\Mail;
use App\Models\Transaction;
use App\Models\User;
use App\Trait\HandlesAttachments;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\HigherOrderBuilderProxy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\HigherOrderCollectionProxy;
use Illuminate\Validation\UnauthorizedException;

class MailService
{
    use HandlesAttachments;

    /**
     * Get mails the user sent.
     * Display a listing of the mails' data with receiver name and address.
     * Display the number of the attachment's if there is any.
     *
     * @param string $userId
     * @return mixed
     * @throws Exception
     */
    public function getMailsFromUser(string $userId): mixed
    {
        $user = User::query()->find($userId);
        if (!$user) throw new Exception('User not found');

        $mails = $user->sentMails()->get();
        return $mails->map(function ($mail) {
            return [
                'id' => $mail->id,
                'name' => $mail->user_to->name,
                'email' => $mail->user_to->email,
                'subject' => $mail->subject,
                'message' => $mail->message,
                'reply_to' => $mail->reply_to,
                'attachment_counter' => $mail->attachments()->count(),
                'time' => $mail->pivot->sent_at,
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }


    /**
     * Get mails the user received.
     * Display a listing of the mails' data with sender name and address.
     * Display the number of the attachment's if there is any.
     *
     * @param string $userId
     * @return mixed
     * @throws Exception
     */
    public function getMailsToUser(string $userId): mixed
    {
        $user = User::query()->find($userId);
        if (!$user) throw new Exception('User not found');

        $mails = $user->receivedMails()->get();
        return $mails->map(function ($mail) {
            return [
                'id' => $mail->id,
                'name' => $mail->user_from->name,
                'email' => $mail->user_from->email,
                'subject' => $mail->subject,
                'message' => $mail->message,
                'reply_to' => $mail->reply_to,
                'attachment_counter' => $mail->attachments()->count(),
                'time' => $mail->pivot->received_at,
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }


    /**
     * Get mails the user deleted.
     * Display a listing of the mails' data with sender/receiver name and address.
     * Display the number of the attachment's if there is any.
     *
     * @param string $userId
     * @return mixed
     * @throws Exception
     */
    public function getDeletedMails(string $userId): mixed
    {
        $user = User::query()->find($userId);
        if (!$user) throw new Exception('User not found');

        $mails = $user->deletedMails()->get();
        return $mails->map(function ($mail) {
            return [
                'id' => $mail->id,
                'name' => $mail->user_to->name ?? $mail->user_from->name,
                'email' => $mail->user_to->email ?? $mail->user_from->email,
                'subject' => $mail->subject,
                'reply_to' => $mail->reply_to,
                'attachment' => $mail->attachment,
                'time' => $mail->pivot_deleted_at,
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }


    /**
     * Create a new mail object from the form request, set the 'is_draft' field false.
     * Create 2 transaction objects for the sender and the receiver.
     * Use HandlesAttachments trait to save attachment files.
     *
     * @param SendMailRequest $request
     * @return mixed
     */
    public function sendNewMail(SendMailRequest $request): mixed
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

            $mailId = $newMail->id;
            $this->handleAttachments($request, $mailId);

            return $newMail;
        });
    }


    /**
     * Update an existing mail object from the form request, set the 'is_draft' field false.
     * Check the transactions related to the mail.
     * Update the sender's transaction with current sending date.
     * Update the recipient's transaction if exists, create a new if not.
     * Use HandlesAttachments trait to save attachment files.
     *
     * @param string $mailId
     * @param SendMailRequest $request
     * @return mixed
     */
    public function sendUpdatedMail(string $mailId, SendMailRequest $request): mixed
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

            $this->handleAttachments($request, $mailId);

            return $mailToUpdate;
        });
    }


    /**
     * Display a mail by user id and mail id.
     * Update the 'opened_at' field with timestamp if null.
     * Return mail data, attachments, username and address.
     *
     * @param TransactionUpdateRequest $request
     * @return array
     * @throws UnauthorizedException
     */
    public function displayMail(TransactionUpdateRequest $request): array
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
            $displayTransaction->refresh();
        }

        $mail = $displayTransaction->mail;
        $userFrom = $mail->user_from()->first();
        $userTo = $mail->user_to()->first();

        $fileNames = $mail->attachments->map(function($attachment) {return[
            'id' => $attachment->id,
            'filename' => $attachment->filename
            ];
        })->toArray();

        return
            [
                'mail_id' => $displayTransaction->mail_id,
                'subject' => $displayTransaction->mail->subject,
                'message' => $displayTransaction->mail->message,
                'reply_to' => $displayTransaction->mail->reply_to,
                'attachment' => $fileNames,
                'sent' => $displayTransaction->sent_at,
                'received' => $displayTransaction->received_at,
                'opened_at' => $displayTransaction->opened_at,
                'user_to_name' => $userTo->name ?? '',
                'user_to_email' => $userTo->email ?? '',
                'user_from_name' => $userFrom->name ?? '',
                'user_from_email' => $userFrom->email ?? ''
            ];
    }


    /**
     * Soft delete the specified mail via transactions table for the specified user.
     * Update the 'deleted_at' field with timestamp if null.
     *
     * @param TransactionUpdateRequest $request
     * @return Model|Collection|Builder|array|null
     * @throws Exception
     */
    public function deleteMail(TransactionUpdateRequest $request): Model|Collection|Builder|array|null
    {
        $deleteTransaction = Transaction::query()
            ->where('user_id', $request['user_id'])
            ->where('mail_id', $request['mail_id'])
            ->first();
        if (!$deleteTransaction) {
            throw new UnauthorizedException('Cannot access this content');
        }
        if ($deleteTransaction->deleted_at != null) {
            throw new Exception('Mail is already deleted');
        }

        if ($deleteTransaction->deleted_at === null) {
            $deleteTransaction->update(['deleted_at' => now()]);
        }
        $deleteTransaction->refresh();

        return $deleteTransaction->mail()->first();
    }


    /**
     * Set back original state of a mail - undelete, mark as not read.
     * Set the connecting fields to null.
     *
     * @param TransactionUpdateRequest $request
     * @return HigherOrderBuilderProxy|Model|HigherOrderCollectionProxy|mixed|object
     * @throws Exception
     */
    public function restoreMail(TransactionUpdateRequest $request): mixed
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
}
