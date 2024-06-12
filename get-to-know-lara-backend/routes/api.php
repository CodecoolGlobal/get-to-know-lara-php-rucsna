<?php

use App\Http\Controllers\DraftController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MailController;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/authentication/logout', [AuthController::class, 'logout']);

    // mail related routes
    Route::get('/mails/{type}/{userId}', [MailController::class, 'getMailsByUser']);
    Route::post('/mail/send', [MailController::class, 'sendNewMail']);
    Route::post('/mail/send/{mailId}', [MailController::class, 'sendUpdatedMail']);
    Route::patch('/mail/display', [MailController::class, 'displayMail']);
    Route::patch('/mail/delete', [MailController::class, 'remove']);
    Route::patch('mail/restore', [MailController::class, 'restoreMail']);

    // draft related routes
    Route::get('/drafts/{userId}', [DraftController::class, 'getDraftsByUser']);
    Route::post('/draft', [DraftController::class, 'createDraft']);
    Route::patch('/draft/save', [DraftController::class, 'updateDraft']);
    Route::patch('/draft/display', [DraftController::class, 'displayDraft']);
    Route::delete('/draft/deleteDraft/{mailId}/{userId}', [DraftController::class, 'deleteDraft']);

    Route::get('/user/addresses/{term}', [UserController::class, 'getUsersEmailAddresses']);
});

Route::post('/authentication/register', [AuthController::class, 'register']);
Route::post('/authentication/login', [AuthController::class, 'login']);




