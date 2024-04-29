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
        $user = User::query()->find($userId);

        $mails = $user->mails()
            ->with(['user_from', 'user_to'])
            ->whereNotNull($type === 'inbox' ? 'received_at' : 'sent_at')
            ->orderByDesc($type === 'inbox' ? 'received_at' : 'sent_at')
            ->get();

        return $mails->map(function ($mail) use ($type) {
            $user = $type === 'inbox' ? 'user_from' : 'user_to';
            return [
                $user . '_name' => $mail->{$user}->name,
                $user . '_email' => $mail->{$user}->email,
                'subject' => $mail->subject,
                'time' => $mail->pivot->{$type === 'inbox' ? 'received_at' : 'sent_at'}
            ];
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Mail
    {
        $request->validate([
            'subject' => 'required',
            'message' => 'required'
            ]);

        return Mail::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Mail::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mail = Mail::find($id);
        $mail->update($request->all());
        return $mail;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): ?bool
    {
        return Mail::destroy($id);
    }

    /**
     * Display a listing of the mails by sender.
     */
    public function getBySenderId(string $id): Collection
    {
        return Mail::where('id_user_from', $id)->get();
    }

    /**
     * Display a listing of the mails by receiver.
     */
    public function getByReceiverId(string $id): Collection
    {
        return Mail::where('id_user_to', $id)->get();
    }
}
