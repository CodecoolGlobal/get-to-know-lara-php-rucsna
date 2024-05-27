<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Mail extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'user_id_from',
        'user_id_to',
        'subject',
        'message',
        'attachment',
        'reply_to',
        'is_draft'
    ];

    public function user_from(): HasOneThrough
    {
        return $this
            ->hasOneThrough(User::class, Transaction::class, 'mail_id', 'id', 'id', 'user_id')
            ->whereNotNull('sent_at');
    }

    public function user_to(): HasOneThrough
    {
        return $this
            ->hasOneThrough(User::class, Transaction::class, 'mail_id', 'id', 'id', 'user_id')
            ->whereNotNull('received_at');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'mail_id');
    }
}
