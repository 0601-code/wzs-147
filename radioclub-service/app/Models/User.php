<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'campus_id',
        'phone',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'status' => 'boolean',
    ];

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function isTeacher()
    {
        return $this->role === 'teacher';
    }

    public function isAnchor()
    {
        return $this->role === 'anchor';
    }

    public function isEquipmentAdmin()
    {
        return $this->role === 'equipment_admin';
    }

    public function anchorSchedules()
    {
        return $this->hasMany(AnchorSchedule::class);
    }

    public function manuscriptsAsAuthor()
    {
        return $this->hasMany(Manuscript::class, 'author_id');
    }

    public function manuscriptsAsReviewer()
    {
        return $this->hasMany(Manuscript::class, 'reviewer_id');
    }

    public function programSchedules()
    {
        return $this->hasMany(ProgramSchedule::class, 'anchor_id');
    }

    public function audioMaterials()
    {
        return $this->hasMany(AudioMaterial::class, 'uploader_id');
    }

    public function equipmentBorrows()
    {
        return $this->hasMany(EquipmentBorrow::class, 'borrower_id');
    }

    public function broadcastLogs()
    {
        return $this->hasMany(BroadcastLog::class, 'anchor_id');
    }

    public function interruptNotices()
    {
        return $this->hasMany(InterruptNotice::class, 'operator_id');
    }
}
