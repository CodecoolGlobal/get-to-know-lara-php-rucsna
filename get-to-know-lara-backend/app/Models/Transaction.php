<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'mail_id',
        'sent_at',
        'received_at',
        'opened_at',
        'deleted_at',
        'has_star'
    ];

    public function mail(): BelongsTo
    {
        return $this->belongsTo(Mail::class, 'mail_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
