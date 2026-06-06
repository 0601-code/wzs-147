<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CampusController;
use App\Http\Controllers\Api\ColumnController;
use App\Http\Controllers\Api\ProgramScheduleController;
use App\Http\Controllers\Api\ManuscriptController;
use App\Http\Controllers\Api\AnchorScheduleController;
use App\Http\Controllers\Api\AudioMaterialController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\EquipmentBorrowController;
use App\Http\Controllers\Api\BroadcastLogController;
use App\Http\Controllers\Api\InterruptNoticeController;
use App\Http\Controllers\Api\UserController;

Route::get('/', function () {
    return response()->json([
        'message' => 'School Radio Club Management API',
        'version' => '1.0.0',
    ]);
});

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('users', UserController::class);

    Route::apiResource('campuses', CampusController::class);

    Route::apiResource('columns', ColumnController::class);

    Route::apiResource('program-schedules', ProgramScheduleController::class);

    Route::apiResource('manuscripts', ManuscriptController::class);
    Route::post('/manuscripts/{manuscript}/submit', [ManuscriptController::class, 'submit']);
    Route::post('/manuscripts/{manuscript}/approve', [ManuscriptController::class, 'approve']);
    Route::post('/manuscripts/{manuscript}/reject', [ManuscriptController::class, 'reject']);

    Route::apiResource('anchor-schedules', AnchorScheduleController::class);

    Route::apiResource('audio-materials', AudioMaterialController::class);

    Route::apiResource('equipment', EquipmentController::class);

    Route::apiResource('equipment-borrows', EquipmentBorrowController::class);
    Route::post('/equipment-borrows/{equipmentBorrow}/return', [EquipmentBorrowController::class, 'returnEquipment']);

    Route::apiResource('broadcast-logs', BroadcastLogController::class);
    Route::post('/broadcast-logs/{broadcastLog}/start', [BroadcastLogController::class, 'start']);
    Route::post('/broadcast-logs/{broadcastLog}/end', [BroadcastLogController::class, 'end']);

    Route::apiResource('interrupt-notices', InterruptNoticeController::class);
    Route::post('/interrupt-notices/{interruptNotice}/broadcast', [InterruptNoticeController::class, 'broadcast']);
    Route::post('/interrupt-notices/{interruptNotice}/cancel', [InterruptNoticeController::class, 'cancel']);
});
