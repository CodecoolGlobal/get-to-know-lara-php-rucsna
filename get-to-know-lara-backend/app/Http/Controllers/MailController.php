<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use App\Models\Mail;
use Illuminate\Support\Facades\DB;

class MailController extends Controller
{
    /**
     * Mails by user for Inbox and Sent pages.
     * Get user's name, email, mail subject, and time of sending.
     * Display a listing of the mails data the user received/sent (latest first).
     * Only those that are not deleted.
     */
    public function getMailsByUser(string $type, string $userId): \Illuminate\Support\Collection
    {
        $user = User::query()->findOrFail($userId);

        $mails = $user->mails()
            ->with(['user_from', 'user_to'])
            ->whereNull('deleted_at')
            ->whereNotNull($type === 'inbox' ? 'received_at' : 'sent_at')
            ->orderByDesc($type === 'inbox' ? 'received_at' : 'sent_at')
            ->get();

        return $mails->map(function ($mail) use ($type) {
            $user = $type === 'inbox' ? 'user_from' : 'user_to';
            return [
                $user . '_name' => $mail->{$user}->name,
                $user . '_email' => $mail->{$user}->email,
                'subject' => $mail->subject,
                'time' => $mail->pivot->{$type === 'inbox' ? 'received_at' : 'sent_at'},
                'opened_at' => $mail->pivot->opened_at
            ];
        });
    }

    /**
     * Store a newly created mail as a draft.
     * The mail is not sent yet, receiver, subject, message, attachment, reply all optional.
     */
    public function createDraft(Request $request): Model|Builder
    {
        $request->validate([
            'from' => 'required|exists:users,id',
            'to' => 'sometimes|nullable|exists:users,id',
            'reply_to' => 'sometimes|nullable|exists:mails,id'
        ]);

        return Mail::query()->create([
            'user_id_from' => $request['from'],
            'user_id_to' => $request['to'],
            'subject' => $request['subject'],
            'message' => $request['message'],
            'attachment' => $request['attachment'],
            'reply_to' => $request['reply_to']
        ]);
    }

    /**
     * Store a newly created mail or update already existing draft.
     * Create 2 new transactions for sender and receiver.
     */
    public function sendMail(Request $request, ?string $mailId = null)
    {
        $request->validate([
            'from' => 'required|exists:users,id',
            'to' => 'required|exists:users,id',
            'reply_to' => 'sometimes|nullable|exists:mails,id'
        ]);
        if ($mailId === null) {
            return DB::transaction(function () use ($request){
                $newMail = Mail::query()->create([
                        'user_id_from' => $request['from'],
                        'user_id_to' => $request['to'],
                        'subject' => $request['subject'],
                        'message' => $request['message']
                ]);

                Transaction::query()->create([
                        'user_id' => $request['from'],
                        'mail_id' => $newMail->id,
                        'sent_at' => now()
                ]);

                Transaction::query()->create([
                        'user_id' => $request['to'],
                        'mail_id' => $newMail->id,
                        'received_at' => now()
                ]);
                return $newMail;
                });
        } else {
               return DB::transaction(function () use ($request, $mailId){
                    $updatedMail = Mail::query()->find($mailId);
                    $updatedMail->update([
                        'user_id_to' => $request['to'],
                        'subject' => $request['subject'],
                        'message' => $request['message'],
                        'attachment' => $request['attachment']
                    ]);
                    $updatedMail->save();
                    Transaction::query()->create([
                        'user_id' => $request['from'],
                        'mail_id' => $mailId,
                        'sent_at' => now()
                    ]);
                    Transaction::query()->create([
                        'user_id' => $request['to'],
                        'mail_id' => $mailId,
                        'received_at' => now()
                    ]);
                    return $updatedMail;
                });
        }
    }

    /**
     * Display the specified mail.
     * Update the related transaction with opened_at timestamp.
     */
    public function readMail(string $mailId): Builder|array|Collection|Model
    {
        $mailToOpen = Mail::query()->findOrFail($mailId);
        $mailToOpen->transactions()
            ->whereNotNull('received_at')
            ->whereNull('deleted_at')
            ->update(['opened_at' => now()]);
        return $mailToOpen;
    }

    /**
     * Remove the specified resource from storage.
     * Update the related transaction with deleted_at timestamp.
     */
    public function remove(string $mailId, string $userId): Model|Collection|Builder|array|null
    {
        $mailToDelete = Mail::query()->findOrFail($mailId);
        $mailToDelete->transactions()
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->update(['deleted_at' => now()]);
        return $mailToDelete;
    }

    /**
     *
     */
    public function getDeletedMails(string $userId)
    {
        $user = User::query()->findOrFail($userId);

        $deletedMails = $user->mails()->whereNotNull('deleted_at')->orderByDesc('deleted_at')->get();

        return $deletedMails->map(function ($mail) use ($userId){
            $user = $mail->user_id_from === $userId ? 'user_from' : 'user_to';
            return [
                $user . '_name' => $mail->{$user}->name,
                $user . '_email' => $mail->{$user}->email,
                'subject' => $mail->subject,
                'time' => $mail->pivot->deleted_at
            ];
        });
    }

    public function getDraftsByUser(string $userId)
    {
        // get all mail by user where userId == user_id_from
        // omit the mails that has transactions
        // return those
    }

//


//    public function getTransactionByUser(string $id){
//        $user = User::query()->find($id);
//        return $user->received()->get();
//    }
//
//    public function getUser(string $id)
//    {
//        $mail = Mail::query()->find($id);
//        return $mail->user_to()->get();
//    }
}
