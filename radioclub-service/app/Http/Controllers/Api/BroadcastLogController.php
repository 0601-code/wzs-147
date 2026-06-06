<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BroadcastLog;
use Illuminate\Http\Request;

class BroadcastLogController extends Controller
{
    public function index(Request $request)
    {
        $query = BroadcastLog::with(['programSchedule', 'anchor', 'campus']);

        if ($request->has('program_schedule_id')) {
            $query->where('program_schedule_id', $request->program_schedule_id);
        }

        if ($request->has('anchor_id')) {
            $query->where('anchor_id', $request->anchor_id);
        }

        if ($request->has('campus_id')) {
            $query->where('campus_id', $request->campus_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['data' => $logs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_schedule_id' => 'nullable|exists:program_schedules,id',
            'actual_start_time' => 'nullable|date',
            'actual_end_time' => 'nullable|date|after:actual_start_time',
            'anchor_id' => 'nullable|exists:users,id',
            'status' => 'string|in:pending,in_progress,completed',
            'notes' => 'nullable|string',
            'campus_id' => 'nullable|exists:campuses,id',
        ]);

        $log = BroadcastLog::create($validated);

        return response()->json([
            'message' => '播出记录创建成功',
            'data' => $log->load(['programSchedule', 'anchor', 'campus']),
        ], 201);
    }

    public function show(BroadcastLog $broadcastLog)
    {
        return response()->json(['data' => $broadcastLog->load(['programSchedule', 'anchor', 'campus'])]);
    }

    public function start(Request $request, BroadcastLog $broadcastLog)
    {
        if ($broadcastLog->status !== 'pending') {
            return response()->json(['message' => '只有待开始的记录可以开始'], 400);
        }

        $broadcastLog->startBroadcast();

        return response()->json([
            'message' => '播出开始',
            'data' => $broadcastLog->load(['programSchedule', 'anchor', 'campus']),
        ]);
    }

    public function end(Request $request, BroadcastLog $broadcastLog)
    {
        if ($broadcastLog->status !== 'in_progress') {
            return response()->json(['message' => '只有进行中的记录可以结束'], 400);
        }

        $broadcastLog->endBroadcast();

        return response()->json([
            'message' => '播出结束',
            'data' => $broadcastLog->load(['programSchedule', 'anchor', 'campus']),
        ]);
    }

    public function update(Request $request, BroadcastLog $broadcastLog)
    {
        $validated = $request->validate([
            'program_schedule_id' => 'nullable|exists:program_schedules,id',
            'actual_start_time' => 'nullable|date',
            'actual_end_time' => 'nullable|date|after:actual_start_time',
            'anchor_id' => 'nullable|exists:users,id',
            'status' => 'string|in:pending,in_progress,completed',
            'notes' => 'nullable|string',
            'campus_id' => 'nullable|exists:campuses,id',
        ]);

        $broadcastLog->update($validated);

        return response()->json([
            'message' => '播出记录更新成功',
            'data' => $broadcastLog->load(['programSchedule', 'anchor', 'campus']),
        ]);
    }

    public function destroy(BroadcastLog $broadcastLog)
    {
        $broadcastLog->delete();

        return response()->json([
            'message' => '播出记录删除成功',
        ]);
    }
}
