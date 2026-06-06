<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'duration',
        'broadcast_time',
        'status',
        'campus_id',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function programSchedules()
    {
        return $this->hasMany(ProgramSchedule::class);
    }

    public function manuscripts()
    {
        return $this->hasMany(Manuscript::class);
    }

    public function audioMaterials()
    {
        return $this->hasMany(AudioMaterial::class);
    }
}
