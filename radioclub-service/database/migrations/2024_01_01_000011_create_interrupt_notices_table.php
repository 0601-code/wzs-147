<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interrupt_notices', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('reason')->comment('插播原因');
            $table->timestamp('schedule_time')->nullable();
            $table->timestamp('actual_broadcast_time')->nullable();
            $table->enum('status', ['pending', 'broadcasted', 'cancelled'])->default('pending');
            $table->foreignId('operator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('campus_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interrupt_notices');
    }
};
