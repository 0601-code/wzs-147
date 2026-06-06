<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('column_id')->constrained()->onDelete('cascade');
            $table->date('broadcast_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignId('anchor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('scheduled')->comment('scheduled/ongoing/completed/cancelled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_schedules');
    }
};
