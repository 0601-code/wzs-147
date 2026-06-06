<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AudioMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'file_path',
        'file_type',
        'duration',
        'column_id',
        'uploader_id',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function column()
    {
        return $this->belongsTo(Column::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }
}
