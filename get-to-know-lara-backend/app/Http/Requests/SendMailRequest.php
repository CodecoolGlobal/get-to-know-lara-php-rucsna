<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SendMailRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'user_id_from' => 'required|exists:users,id',
            'user_id_to' => 'required|exists:users,id',
            'subject' => 'max:100',
            'is_draft' => 'required|boolean',
            'reply_to' => 'sometimes|nullable|exists:mails,id',
            'mail_id' => 'sometimes|nullable|exists:mails,id',
            'attachment' => 'file|max:10240'
        ];
    }

    public function allowed(): array
    {
        return $this->only([
            'user_id_from',
            'user_id_to',
            'subject',
            'message',
            'is_draft',
            'reply_to',
            'attachment'
        ]);
    }
}
