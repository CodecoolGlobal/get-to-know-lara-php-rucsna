<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mail extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'id_user_from',
        'id_user_to',
        'subject',
        'message',
        'is_read',
        'sent'
    ];

    public function user_from(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id_from', 'id');
    }

    public function user_to(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_to', 'id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'mail_id');
    }
}
