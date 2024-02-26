<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $all)
 * @method static findOrFail(string $id)
 * @method static find(string $id)
 */
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
}
