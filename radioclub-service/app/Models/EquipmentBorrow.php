<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentBorrow extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipment_id',
        'borrower_id',
        'borrower_name',
        'borrow_date',
        'expected_return_date',
        'actual_return_date',
        'status',
        'purpose',
        'return_check_note',
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'expected_return_date' => 'date',
        'actual_return_date' => 'date',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function borrower()
    {
        return $this->belongsTo(User::class, 'borrower_id');
    }

    public function isBorrowed()
    {
        return $this->status === 'borrowed';
    }

    public function isReturned()
    {
        return $this->status === 'returned';
    }

    public function isOverdue()
    {
        return $this->status === 'overdue';
    }

    public function returnEquipment($returnCheckNote = null)
    {
        $this->status = 'returned';
        $this->actual_return_date = now();
        $this->return_check_note = $returnCheckNote;
        $this->save();

        if ($this->equipment) {
            $this->equipment->markAsAvailable();
        }
    }

    public function markOverdue()
    {
        if ($this->isBorrowed() && now()->gt($this->expected_return_date)) {
            $this->status = 'overdue';
            $this->save();
            return true;
        }
        return false;
    }
}
