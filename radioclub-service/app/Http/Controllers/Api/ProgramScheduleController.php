<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramSchedule;
use Illuminate\Http\Request;

class ProgramScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = ProgramSchedule::with(['column', 'anchor']);

        if ($request->has('column_id')) {
            $query->where('column_id', $request->column_id);
        }

        if ($request->has('anchor_id')) {
            $query->where('anchor_id', $request->anchor_id);
        }

        if ($request->has('broadcast_date')) {
            $query->whereDate('broadcast_date', $request->broadcast_date);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('broadcast_date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $schedules = $query->orderBy('broadcast_date')->orderBy('start_time')->paginate($request->per_page ?? 15);

        return response()->json(['data' => $schedules]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'column_id' => 'required|exists:columns,id',
            'broadcast_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'anchor_id' => 'nullable|exists:users,id',
            'status' => 'string|in:scheduled,ongoing,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $schedule = ProgramSchedule::create($validated);

        return response()->json([
            'message' => '节目编排创建成功',
            'data' => $schedule->load(['column', 'anchor']),
        ], 201);
    }

    public function show(ProgramSchedule $programSchedule)
    {
        return response()->json(['data' => $programSchedule->load(['column', 'anchor', 'broadcastLogs'])]);
    }

    public function update(Request $request, ProgramSchedule $programSchedule)
    {
        $validated = $request->validate([
            'column_id' => 'exists:columns,id',
            'broadcast_date' => 'date',
            'start_time' => 'date_format:H:i',
            'end_time' => 'date_format:H:i|after:start_time',
            'anchor_id' => 'nullable|exists:users,id',
            'status' => 'string|in:scheduled,ongoing,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $programSchedule->update($validated);

        return response()->json([
            'message' => '节目编排更新成功',
            'data' => $programSchedule->load(['column', 'anchor']),
        ]);
    }

    public function destroy(ProgramSchedule $programSchedule)
    {
        $programSchedule->delete();

        return response()->json([
            'message' => '节目编排删除成功',
        ]);
    }
}
