<?php

namespace App\Http\Controllers;

use App\Http\Requests\DraftRequest;
use App\Http\Requests\SendMailRequest;
use App\Models\Transaction;
use App\Models\User;
use App\Services\MailService;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Mail;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;

class MailController extends Controller
{
    protected MailService $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    /**
     * Mails by user for Inbox and Sent pages.
     * Get user's name, email, mail subject, and time of sending.
     * Display a listing of the mails data the user received/sent (latest first).
     * Only those that are not deleted.
     */
    public function getMailsByUser(string $type, string $userId): JsonResponse
    {
        try {
            $mailsResponse = $this->mailService->getMailsByUser($type, $userId);
            return response()->json([
                'mails' => $mailsResponse
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return \response()->json([
                'message' => 'Error fetching mails' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Store a newly created mail as a draft.
     * The mail is not sent yet, receiver, subject, message, attachment, reply_to all optional fields.
     */
    public function createDraft(DraftRequest $request): JsonResponse
    {
        try {
            $newDraft = Mail::query()->create($request->allowed());
            return response()->json([
                'draft' => $newDraft
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error creating draft' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Store a newly created mail or update already existing draft.
     * Create 2 new transactions for sender and receiver.
     */
    public function sendMail(SendMailRequest $request, ?string $mailId = null): JsonResponse
    {
        try {
            if ($mailId === null) {
                $mailToSend = $this->mailService->createMailWithTransactions($request);
            } else {
                $mailToSend = $this->mailService->updateMailWithTransactions($request, $mailId);
            }
            if(!$mailToSend){
                return response()->json(['message' => 'Error creating or updating mail'], Response::HTTP_BAD_REQUEST);
            }
            return response()->json([
                'mail' => $mailToSend,
                'message' => 'Mail successfully sent'
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error sending mail' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Display the specified mail.
     * Update the related transaction with opened_at timestamp.
     * @throws Exception
     */
    public function displayMail(string $mailId): JsonResponse
    {
        try {
            $mailToDisplay = $this->mailService->displayMail($mailId);
            return response()->json([
                'mail' => $mailToDisplay
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error displaying mail - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Soft delete the specified mail.
     * Update the related transaction with deleted_at timestamp.
     */
    public function remove(string $mailId, string $userId): JsonResponse
    {
        try {
            $deletedMail = $this->mailService->deleteMail($userId, $mailId);
            return response()->json([
                'mail' => $deletedMail
            ], Response::HTTP_OK);
        } catch (Exception $exception)
        {
            return response()->json([
                'message' => 'Error deleting mail - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Display the user's deleted mails.
     * List data through transactions table 'deleted_at' field.
     */
    public function getDeletedMails(string $userId): JsonResponse
    {
        try {
            $deletedMails = $this->mailService->getDeletedMails($userId);
            return response()->json([
                'mails' => $deletedMails
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error fetching mails - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Restore the user's deleted mails.
     * Set the 'deleted_at' field back to null.
     */
    public function restoreDeletedMail(string $mailId, string $userId): JsonResponse
    {
        try {
            $restoredMail = $this->mailService->restoreDeletedMails($userId, $mailId);
            return response()->json([
                'mail' => $restoredMail
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error restoring mail - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Remove the specified mail from storage.
     */
    public function deleteDraft($mailId, $userId): JsonResponse
    {
        try {
            $this->mailService->deleteDraft($mailId, $userId);
            return response()->json([
                'mailId' => $mailId
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error deleting draft - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getDraftsByUser(string $userId): JsonResponse
    {
        try {
            $drafts = $this->mailService->getDraftsByUser($userId);
            return response()->json([
                'drafts' => $drafts
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error fetching drafts - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
