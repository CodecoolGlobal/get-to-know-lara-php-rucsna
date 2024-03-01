<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use App\Models\Mail;

class MailController extends Controller
{
    /**
     * Display a listing of the mails.
     */
    public function index(): Collection
    {
        return Mail::all();
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
