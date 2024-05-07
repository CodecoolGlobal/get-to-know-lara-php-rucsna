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
            'reply_to' => 'sometimes|nullable|exists:mails,id'
        ];
    }

    public function allowed(): array
    {
        return $this->only([
            'user_id_from',
            'user_id_to',
            'subject',
            'message',
            'reply_to',
            'attachment',
            'mail_id',
            'sent_at',
            'received_at'
        ]);
    }
}
