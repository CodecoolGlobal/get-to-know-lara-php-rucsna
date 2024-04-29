<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MailController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/mailsByUser/{type}/{id}', [MailController::class, 'getMailsByUser']);
    Route::post('/mail', [MailController::class, 'createDraft']);
    Route::post('/sendMail/{id?}', [MailController::class, 'sendMail']);
    Route::get('/mail/{id}', [MailController::class, 'readMail']);

//    Route::patch('/mail/{id}', [MailController::class, 'update']);
//    Route::patch('/mail/delete/{id}', [MailController::class, 'remove']);
//    Route::get('/usersEmail', [UserController::class, 'getUsersEmailAddresses']);
//    Route::get('/transaction/{id}', [MailController::class, 'getTransactionByUser']);
//    Route::get('/userByMail/{id}', [MailController::class, 'getUser']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);




