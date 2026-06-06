<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnchorSchedule;
use Illuminate\Http\Request;

class AnchorScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = AnchorSchedule::with('user');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('shift')) {
            $query->where('shift', $request->shift);
        }

        $schedules = $query->orderBy('date')->paginate($request->per_page ?? 15);

        return response()->json(['data' => $schedules]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'shift' => 'required|in:morning,noon,evening',
            'status' => 'boolean',
        ]);

        $exists = AnchorSchedule::where('user_id', $validated['user_id'])
            ->where('date', $validated['date'])
            ->where('shift', $validated['shift'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => '该主播在该时间段已有排班'], 400);
        }

        $schedule = AnchorSchedule::create($validated);

        return response()->json([
            'message' => '主播排班创建成功',
            'data' => $schedule->load('user'),
        ], 201);
    }

    public function show(AnchorSchedule $anchorSchedule)
    {
        return response()->json(['data' => $anchorSchedule->load('user')]);
    }

    public function update(Request $request, AnchorSchedule $anchorSchedule)
    {
        $validated = $request->validate([
            'user_id' => 'exists:users,id',
            'date' => 'date',
            'shift' => 'in:morning,noon,evening',
            'status' => 'boolean',
        ]);

        $anchorSchedule->update($validated);

        return response()->json([
            'message' => '主播排班更新成功',
            'data' => $anchorSchedule->load('user'),
        ]);
    }

    public function destroy(AnchorSchedule $anchorSchedule)
    {
        $anchorSchedule->delete();

        return response()->json([
            'message' => '主播排班删除成功',
        ]);
    }
}
