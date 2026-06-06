<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manuscript extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'column_id',
        'author_id',
        'reviewer_id',
        'status',
        'feedback',
        'submit_time',
        'review_time',
    ];

    protected $casts = [
        'submit_time' => 'datetime',
        'review_time' => 'datetime',
    ];

    public function column()
    {
        return $this->belongsTo(Column::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function submit()
    {
        $this->status = 'submitted';
        $this->submit_time = now();
        $this->save();
    }

    public function approve($reviewerId, $feedback = null)
    {
        $this->status = 'approved';
        $this->reviewer_id = $reviewerId;
        $this->review_time = now();
        $this->feedback = $feedback;
        $this->save();
    }

    public function reject($reviewerId, $feedback = null)
    {
        $this->status = 'rejected';
        $this->reviewer_id = $reviewerId;
        $this->review_time = now();
        $this->feedback = $feedback;
        $this->save();
    }
}
