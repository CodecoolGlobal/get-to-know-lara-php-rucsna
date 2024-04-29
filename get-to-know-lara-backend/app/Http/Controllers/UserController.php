<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Collection;

class UserController extends Controller
{
    /**
     * Display a listing of the users' email addresses.
     */
    public function getUsersEmailAddresses(): Collection
    {
        $users = User::query()->pluck('email', 'id');
        return $users->map(function ($email, $id) {
            return['id' => $id, 'email' => $email];
    })->values();
    }
}
