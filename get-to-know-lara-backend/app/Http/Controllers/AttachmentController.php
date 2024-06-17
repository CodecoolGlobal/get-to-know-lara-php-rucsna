<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AttachmentController extends Controller
{
    public function download($attachmentId, $mailId, $userId)
    {
        try{
            $downloadTransaction = Transaction::query()
                ->where('user_id', $userId)
                ->where('mail_id', $mailId)
                ->first();
            //echo $downloadTransaction;
//            if(!$downloadTransaction) {
//                return response()->json([
//                    'message' => 'Cannot access this content'
//                ], Response::HTTP_UNAUTHORIZED);
//            }

            $attachmentToDownload = $downloadTransaction->mail->attachments()->find($attachmentId);
            echo $attachmentId;
            echo $downloadTransaction->mail->attachments()->find($attachmentId);
            if(!$attachmentToDownload) {
                return response()->json([
                    'message' => 'Attachment not found'
                ], Response::HTTP_NOT_FOUND);
            }

            $fileContent = base64_decode($attachmentToDownload->file);

            return response($fileContent, 200, [
                'Content-Type' => 'application/octet-stream',
                'Content-Disposition' => 'attachment; filename="' . $attachmentToDownload->filename . '"',
                'Access-Control-Allow-Origin' => '*',
            ]);
        } catch(\Exception $exception){
            return response()->json([
                'message' => 'Error downloading file - ' . $exception->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a specified attachment related to a user's mail transaction.
     *
     * @param $userId
     * @param $mailId
     * @param $attachmentId
     * @return JsonResponse
     */
    public function delete($userId, $mailId, $attachmentId): JsonResponse
    {
        try{
            $deleteTransaction = Transaction::query()
                ->where('user_id', $userId)
                ->where('mail_id', $mailId)
                ->first();
            if(!$deleteTransaction) {
                return response()->json([
                    'message' => 'Cannot access this content'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $attachmentToDelete = $deleteTransaction->mail->attachments->find($attachmentId);
            if(!$attachmentToDelete) {
                return response()->json([
                    'message' => 'Attachment not found'
                ], Response::HTTP_NOT_FOUND);
            }

            $attachmentToDelete->delete();
            return response()->json([
                'message' => 'Attachment successfully deleted'
            ], Response::HTTP_OK);

        } catch (\Exception $exception){
            return response()->json([
                'message' => 'Error deleting attachment - ' . $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
