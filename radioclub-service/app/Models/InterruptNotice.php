<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterruptNotice extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'reason',
        'schedule_time',
        'actual_broadcast_time',
        'status',
        'operator_id',
        'campus_id',
    ];

    protected $casts = [
        'schedule_time' => 'datetime',
        'actual_broadcast_time' => 'datetime',
    ];

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isBroadcasted()
    {
        return $this->status === 'broadcasted';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    public function markAsBroadcasted()
    {
        $this->status = 'broadcasted';
        $this->actual_broadcast_time = now();
        $this->save();
    }

    public function cancel()
    {
        $this->status = 'cancelled';
        $this->save();
    }
}
