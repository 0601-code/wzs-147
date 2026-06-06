<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'brand',
        'model',
        'serial_number',
        'status',
        'campus_id',
        'purchase_date',
    ];

    protected $casts = [
        'purchase_date' => 'date',
    ];

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function borrows()
    {
        return $this->hasMany(EquipmentBorrow::class);
    }

    public function currentBorrow()
    {
        return $this->hasOne(EquipmentBorrow::class)->where('status', 'borrowed')->latest();
    }

    public function isAvailable()
    {
        return $this->status === 'available';
    }

    public function isBorrowed()
    {
        return $this->status === 'borrowed';
    }

    public function isMaintenance()
    {
        return $this->status === 'maintenance';
    }

    public function markAsBorrowed()
    {
        $this->status = 'borrowed';
        $this->save();
    }

    public function markAsAvailable()
    {
        $this->status = 'available';
        $this->save();
    }

    public function markAsMaintenance()
    {
        $this->status = 'maintenance';
        $this->save();
    }
}
