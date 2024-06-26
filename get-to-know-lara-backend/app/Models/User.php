<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * @throws Exception
     */
    public static function findUser($id): Model|Collection|Builder|array
    {
        $user = static::query()->find($id);
        if(!$user){
            throw new Exception('User not found');
        }
        return $user;
    }

    public function mails(): BelongsToMany
    {
        return $this
            ->belongsToMany(Mail::class, 'transactions', 'user_id', 'mail_id')
            ->withPivot('received_at', 'sent_at', 'deleted_at', 'opened_at');
    }

    public function sentMails(): BelongsToMany
    {
        return $this
            ->belongsToMany(Mail::class, 'transactions', 'user_id', 'mail_id')
            ->where('is_draft', false)
            ->wherePivotNull('received_at')
            ->wherePivotNull('deleted_at')
            ->withPivot('sent_at', 'opened_at', 'deleted_at')
            ->orderByDesc('sent_at');
    }

    public function receivedMails(): BelongsToMany
    {
        return $this
            ->belongsToMany(Mail::class, 'transactions', 'user_id', 'mail_id')
            ->where('is_draft', false)
            ->wherePivotNull('sent_at')
            ->wherePivotNull('deleted_at')
            ->withPivot('received_at', 'opened_at', 'deleted_at')
            ->orderByDesc('received_at');
    }

    public function deletedMails(): BelongsToMany
    {
        return $this
            ->belongsToMany(Mail::class, 'transactions', 'user_id', 'mail_id')
            ->where('is_draft', false)
            ->wherePivotNotNull('deleted_at')
            ->withPivot('opened_at', 'deleted_at')
            ->orderBy('deleted_at');
    }

    public function drafts(): BelongsToMany
    {
        return $this
            ->belongsToMany(Mail::class, 'transactions', 'user_id', 'mail_id')
            ->where('is_draft', true)
            ->withPivot('opened_at')
            ->orderByDesc('created_at');
    }
}
