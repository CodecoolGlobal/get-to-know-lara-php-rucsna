<?php

namespace App\Http\Controllers;

use App\Http\Requests\DraftRequest;
use App\Http\Requests\TransactionUpdateRequest;
use App\Services\DraftService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class DraftController extends Controller
{
    protected DraftService $draftService;

    public function __construct(DraftService $draftService)
    {
        $this->draftService = $draftService;
    }


    /**
     * Drafts by user for Drafts page.
     * Get user's name, email, mail subject, and time of creation.
     * Display a listing of the mails data the user has not sent yet (latest first).
     *
     * @param string $userId
     * @return JsonResponse
     */
    public function getDraftsByUser(string $userId): JsonResponse
    {
        try {
            $drafts = $this->draftService->getDraftsByUser($userId);

            return response()->json([
                'mails' => $drafts
            ], Response::HTTP_OK);

        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error fetching drafts - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Store a newly created mail as a draft.
     * The mail is not sent yet, receiver, subject, message, attachment, reply_to all optional fields.
     * Validate the input data using DraftRequest via the DraftService.
     *
     * @param DraftRequest $request
     * @return JsonResponse
     */
    public function createDraft(DraftRequest $request): JsonResponse
    {
        try {
            $newDraft = $this->draftService->createDraft($request);
            return response()->json([
                'draft' => $newDraft
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error creating draft - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Update an already existing draft.
     * Validate the input data using DraftRequest via the DraftService.
     *
     * @param string $mailId
     * @param DraftRequest $request
     * @return JsonResponse
     */
    public function updateDraft(string $mailId, DraftRequest $request): JsonResponse
    {
        try {
            $draftToUpdate = $this->draftService->updateDraft($mailId, $request);
            return response()->json([
                'draft' => $draftToUpdate
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error updating draft - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Display the specified draft.
     * Update the related transaction with opened_at timestamp.
     * @throws Exception
     */
    public function displayDraft(TransactionUpdateRequest $request): JsonResponse
    {
        try {
            $draftToDisplay = $this->draftService->displayDraft($request);
            if(!$draftToDisplay){
                return response()->json(['error' => 'Not Found'],Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'mail' => $draftToDisplay
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error displaying mail - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Remove the specified draft from storage.
     *
     * @param $mailId
     * @param $userId
     * @return JsonResponse
     */
    public function deleteDraft($mailId, $userId): JsonResponse
    {
        try {
            $this->draftService->deleteDraft($mailId, $userId);
            return response()->json([
                'mailId' => $mailId
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            return response()->json([
                'message' => 'Error deleting draft - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
