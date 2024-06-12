<?php

namespace App\Trait;

use App\Models\Attachment;
use Illuminate\Http\Request;

trait HandlesAttachments
{
    /**
     * Check for files in the request.
     * Check if they are already attached to the mail object.
     * Save new attachments into the database.
     *
     * @param Request $request
     * @param string $mailId
     * @return void
     */

    public function handleAttachments(Request $request, string $mailId): void
    {
        if ($request->hasFile('attachment')) {
            foreach ($request->file('attachment') as $file) {
                $filename = $file->getClientOriginalName();
                $fileContent = file_get_contents($file->getRealPath());

                $existingAttachment = Attachment::query()
                    ->where('mail_id', $mailId)
                    ->where('filename', $filename)
                    ->first();

                if(!$existingAttachment){
                    $encodedContent = base64_encode($fileContent);
                    Attachment::query()->create([
                        'mail_id' => $mailId,
                        'filename' => $filename,
                        'file' => $encodedContent
                    ]);
                }
            }
        }
    }
}
