<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
//use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the users' email addresses.
     */
    public function getUsersEmailAddresses(): Collection
    {
        $users = User::pluck('email', 'id');
        return $users->map(function ($email, $id) {
            return['id' => $id, 'email' => $email];
    })->values();
    }
}
