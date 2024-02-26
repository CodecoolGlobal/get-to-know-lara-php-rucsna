<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validatedData = $request->validated();
        $newUser = User::query()->create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password'])
        ]);

        $token = $newUser->createToken('main')->plainTextToken;

        return response([
            'user' => $newUser,
            'token' => $token
        ]);
    }

    public function login(LoginRequest $request)
    {
        $validatedData = $request->validated();
        if(!Auth::attempt($validatedData)){
            return response([
                'message' => 'Provided email address or password is incorrect'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $user = Auth::user();

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response('', Response::HTTP_NO_CONTENT);
    }
}
