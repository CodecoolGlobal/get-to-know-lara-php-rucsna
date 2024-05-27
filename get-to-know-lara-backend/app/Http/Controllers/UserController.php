<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Collection;

class UserController extends Controller
{
    /**
     * Display a listing of the users' email addresses.
     */
    public function getUsersEmailAddresses($term): Collection
    {
        $users = User::query()
            ->where(function($query) use ($term){
                $query->where('name', 'like', '%' . $term . '%')
                    ->orWhere('email', 'like', '%' . $term . '%');
            })
            ->select('name','email', 'id')
            ->get();

        return $users->map(function ($user) {
            return['id' => $user->id, 'name' => $user->name, 'email' => $user->email];
        })->values();
    }
}
