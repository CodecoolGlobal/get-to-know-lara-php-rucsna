<?php

namespace App\Http\Controllers;

use App\Http\Requests\DraftRequest;
use App\Http\Requests\SendMailRequest;
use App\Http\Requests\TransactionUpdateRequest;
use App\Services\MailService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class MailController extends Controller
{
    protected MailService $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }


    /**
     * Get mails by user for Inbox, Sent, and Bin pages.
     * Get user's name, email, mail subject, and time of sending.
     * Display a listing of the mails data the user received/sent (latest first).
     * If no mails found the response is still valid, meaning the user has no mails yet in that category.
     *
     * @param string $type
     * @param string $userId
     * @return JsonResponse
     */
    public function getMailsByUser(string $type, string $userId): JsonResponse
    {
        try {
            $mails = match ($type){
                'inbox' => $this->mailService->getMailsToUser($userId),
                'sent' => $this->mailService->getMailsFromUser($userId),
                'deleted' => $this->mailService->getDeletedMails($userId),
                default => null,
            };

            return response()->json([
                'mails' => $mails
            ], Response::HTTP_OK);

        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error fetching mails' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Send a new mail.
     * Handle mail sending using the provided request data.
     * Validate the input data using SendMailRequest via the MailService
     *
     * @param SendMailRequest $request
     * @return JsonResponse
     */
    public function sendNewMail(SendMailRequest $request): JsonResponse
    {
        try {
            $mailToSend = $this->mailService->sendNewMail($request);
            if(!$mailToSend){
                return response()->json(['message' => 'Error creating mail'], Response::HTTP_BAD_REQUEST);
            }

            return response()->json([
                'message' => 'Mail successfully sent'
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error sending mail - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Send a draft.
     * Handle draft updating and sending using the provided request data.
     * Validate the input data using SendMailRequest via the MailService.
     *
     * @param string $mailId
     * @param SendMailRequest $request
     * @return JsonResponse
     */
    public function sendUpdatedMail(string $mailId, SendMailRequest $request): JsonResponse
    {
        try {
            $mailToSend = $this->mailService->sendUpdatedMail($mailId, $request);
            if(!$mailToSend){
                return response()->json(['message' => 'Error updating mail'], Response::HTTP_BAD_REQUEST);
            }
            return response()->json([
                'mail' => $mailToSend,
                'message' => 'Mail successfully sent'
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error sending mail - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Display the specified mail.
     * Validate the input data using TransactionUpdateRequest via the MailService.
     *
     * @param TransactionUpdateRequest $request
     * @return JsonResponse
     */
    public function displayMail(TransactionUpdateRequest $request): JsonResponse
    {
        try {
            $mailToDisplay = $this->mailService->displayMail($request);
            if(!$mailToDisplay){
                return response()->json(['message' => 'Error updating mail'],Response::HTTP_BAD_REQUEST);
            }

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
     * Validate the input data using TransactionUpdateRequest via the MailService.
     *
     * @param TransactionUpdateRequest $request
     * @return JsonResponse
     */
    public function remove(TransactionUpdateRequest $request): JsonResponse
    {
        try {
            $deletedMail = $this->mailService->deleteMail($request);
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
     * Restore the original state of the specified mail.
     * Validate the input data using TransactionUpdateRequest via the MailService.
     *
     * @param TransactionUpdateRequest $request
     * @return JsonResponse
     */
    public function restoreMail(TransactionUpdateRequest $request): JsonResponse
    {
        try {
            $restoredMail = $this->mailService->restoreMail($request);
            return response()->json([
                'mail' => $restoredMail
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error restoring mail - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
