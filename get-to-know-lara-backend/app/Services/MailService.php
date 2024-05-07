<?php

namespace App\Services;

use App\Http\Requests\SendMailRequest;
use App\Models\Mail;
use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class MailService
{
    /**
     * @throws Exception
     */
    public function getMailsByUser($type, $userId)
    {
        $user = User::findUser($userId);
        $mails = $user->mails()
            ->with(['user_from', 'user_to'])
            ->whereNull('deleted_at')
            ->whereNotNull($type === 'inbox' ? 'received_at' : 'sent_at')
            ->orderByDesc($type === 'inbox' ? 'received_at' : 'sent_at')
            ->get();

        return $mails->map(function ($mail) use ($type) {
            $user = $type === 'inbox' ? 'user_from' : 'user_to';

            $userName = $mail->{$user} ? $mail->{$user}->name : 'Unknown user';
            $userEmail = $mail->{$user} ? $mail->{$user}->email : 'Unknown address';

            return [
                'name' => $userName,
                'email' => $userEmail,
                'subject' => $mail->subject,
                'reply_to' => $mail->reply_to,
                'attachment' => $mail->attachment,
                'time' => $mail->pivot->{$type === 'inbox' ? 'received_at' : 'sent_at'},
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }

    public function createMailWithTransactions(SendMailRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $allowedFields = $request->allowed();

            $newMail = Mail::query()->create($allowedFields);

            $this->createTransactions($allowedFields['user_id_from'], $allowedFields['user_id_to'], $newMail->id);
            return $newMail;
        });
    }

    public function updateMailWithTransactions(SendMailRequest $request, $mailId)
    {
        return DB::transaction(function () use ($request, $mailId) {
            $allowedFields = $request->allowed();

            $mailToUpdate = Mail::query()->find($mailId);
            $mailToUpdate->update($allowedFields);
            $mailToUpdate->save();

            $this->createTransactions($allowedFields['user_id_from'], $allowedFields['user_id_to'], $mailId);
            return $mailToUpdate;
        });
    }

    protected function createTransactions($userIdFrom, $userIdTo, $mailId): void
    {
        Transaction::query()->create([
            'user_id' => $userIdFrom,
            'mail_id' => $mailId,
            'sent_at' => now()
        ]);
        Transaction::query()->create([
            'user_id' => $userIdTo,
            'mail_id' => $mailId,
            'received_at' => now()
        ]);
    }

    /**
     * @throws Exception
     */
    public function displayMail($mailId): Model|Collection|Builder|array|null
    {
        $mailToDisplay = Mail::query()->find($mailId);
        if(!$mailToDisplay){
            throw new Exception('Mail not found');
        }

        $this->markMailAsOpened($mailToDisplay);
        return $mailToDisplay;
    }

    protected function markMailAsOpened($mail): int
    {
        return $mail->transactions()
            ->whereNotNull('received_at')
            ->whereNull('deleted_at')
            ->whereNull('opened_at')
            ->update(['opened_at' => now()]);
    }

    /**
     * @throws Exception
     */
    public function deleteMail($userId, $mailId)
    {
        $user = User::findUser($userId);
        $mailToDelete = $user->mails->where('id', $mailId)->first();
        if(!$mailToDelete){
            throw new Exception('Mail not found');
        }
        if ($mailToDelete->transactions()->where('user_id', $userId)->whereNotNull('deleted_at')->exists()) {
            throw new Exception('Mail is already deleted');
        }
        $this->markMailAsDeleted($mailToDelete, $userId);
        return $mailToDelete;
    }

    protected function markMailAsDeleted($mail, $userId)
    {
        return $mail->transactions()
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->update(['deleted_at' => now()]);
    }

    /**
     * @throws Exception
     */
    public function getDeletedMails($userId)
    {
        $user = User::findUser($userId);
        $deletedMails = $user->mails()
            ->with('user_from')
            ->whereNotNull('deleted_at')
            ->orderByDesc('deleted_at')
            ->get();
        return $deletedMails->map(function ($mail) {
                return [
                    'name' => $mail->user_from->name,
                    'email' => $mail->user_from->email,
                    'subject' => $mail->subject,
                    'time' => $mail->pivot->deleted_at
                ];
        });
    }

    /**
     * @throws Exception
     */
    public function restoreDeletedMails($userId, $mailId)
    {
        $user = User::findUser($userId);
        $mailToRestore = $user->mails->where('id', $mailId)->first();
        if(!$mailToRestore){
            throw new Exception('Mail not found');
        }
        if ($mailToRestore->transactions()
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->exists()) {
            throw new Exception('Mail is not deleted');
        }
        $mailToRestore->transactions()
            ->where('user_id', $userId)
            ->whereNotNull('deleted_at')
            ->update(['deleted_at' => null]);
        $mailToRestore->refresh();
        return $mailToRestore;
    }

    /**
     * @throws Exception
     */
    public function getDraftsByUser($userId): \Illuminate\Support\Collection
    {
        $user = User::findUser($userId);
        return $user->mails
            ->where('user_id_from', $user->id)
            ->doesntHave('transactions')
            ->get();
    }

    /**
     * @throws Exception
     */
    public function deleteDraft($mailId, $userId): void
    {
        $draftToDelete = Mail::query()->find($mailId);
        if(!$draftToDelete){
            throw new Exception('Draft not found');
        }
        $drafts = $this->getDraftsByUser($userId);
        $isDraft = $drafts->contains(function ($draft) use($draftToDelete){
            return $draft->id === $draftToDelete->id;
        });
        if(!$isDraft){
            throw new Exception('Not a draft');
        }
        Mail::destroy($mailId);
    }
}
