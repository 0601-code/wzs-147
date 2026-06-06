<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'column_id',
        'broadcast_date',
        'start_time',
        'end_time',
        'anchor_id',
        'status',
        'notes',
    ];

    protected $casts = [
        'broadcast_date' => 'date',
    ];

    public function column()
    {
        return $this->belongsTo(Column::class);
    }

    public function anchor()
    {
        return $this->belongsTo(User::class, 'anchor_id');
    }

    public function broadcastLogs()
    {
        return $this->hasMany(BroadcastLog::class);
    }
}
