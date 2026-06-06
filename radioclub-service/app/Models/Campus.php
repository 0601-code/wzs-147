<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function columns()
    {
        return $this->hasMany(Column::class);
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class);
    }

    public function broadcastLogs()
    {
        return $this->hasMany(BroadcastLog::class);
    }

    public function interruptNotices()
    {
        return $this->hasMany(InterruptNotice::class);
    }
}
