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
    Route::post('/authentication/logout', [AuthController::class, 'logout']);

    Route::get('/mail/mailsByUser/{type}/{id}', [MailController::class, 'getMailsByUser']);
    Route::post('/mail/draft', [MailController::class, 'createDraft']);
    Route::post('/mail/send', [MailController::class, 'sendNewMail']);
    Route::post('/mail/send/{mailId}', [MailController::class, 'sendUpdatedMail']);
    Route::patch('/mail/display/{type}', [MailController::class, 'displayMail']);
    Route::patch('/mail/delete', [MailController::class, 'remove']);
    //Route::get('/mail/deletedMails/{userId}', [MailController::class, 'getDeletedMails']);
    Route::patch('mail/restore', [MailController::class, 'restoreMail']);

    Route::delete('/mail/deleteDraft/{mailId}/{userId}', [MailController::class, 'deleteDraft']);
    //Route::get('/mail/drafts/{userId}', [MailController::class, 'getDraftsByUser']);

    Route::get('/user/addresses/{term}', [UserController::class, 'getUsersEmailAddresses']);
    Route::get('/sentMails/{id}/{mailId}', [MailController::class, 'sentMails']);
});

Route::post('/authentication/register', [AuthController::class, 'register']);
Route::post('/authentication/login', [AuthController::class, 'login']);




