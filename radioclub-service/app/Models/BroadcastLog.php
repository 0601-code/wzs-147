<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BroadcastLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_schedule_id',
        'actual_start_time',
        'actual_end_time',
        'anchor_id',
        'status',
        'notes',
        'campus_id',
    ];

    protected $casts = [
        'actual_start_time' => 'datetime',
        'actual_end_time' => 'datetime',
    ];

    public function programSchedule()
    {
        return $this->belongsTo(ProgramSchedule::class);
    }

    public function anchor()
    {
        return $this->belongsTo(User::class, 'anchor_id');
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function startBroadcast()
    {
        $this->status = 'in_progress';
        $this->actual_start_time = now();
        $this->save();
    }

    public function endBroadcast()
    {
        $this->status = 'completed';
        $this->actual_end_time = now();
        $this->save();
    }
}
