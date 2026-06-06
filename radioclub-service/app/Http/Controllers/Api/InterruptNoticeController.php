<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InterruptNotice;
use Illuminate\Http\Request;

class InterruptNoticeController extends Controller
{
    public function index(Request $request)
    {
        $query = InterruptNotice::with(['operator', 'campus']);

        if ($request->has('campus_id')) {
            $query->where('campus_id', $request->campus_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('operator_id')) {
            $query->where('operator_id', $request->operator_id);
        }

        if ($request->has('date')) {
            $query->whereDate('schedule_time', $request->date);
        }

        $notices = $query->orderBy('schedule_time', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['data' => $notices]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'reason' => 'required|string',
            'schedule_time' => 'nullable|date',
            'status' => 'string|in:pending,broadcasted,cancelled',
            'operator_id' => 'nullable|exists:users,id',
            'campus_id' => 'nullable|exists:campuses,id',
        ]);

        $notice = InterruptNotice::create($validated);

        return response()->json([
            'message' => '临时插播通知创建成功',
            'data' => $notice->load(['operator', 'campus']),
        ], 201);
    }

    public function show(InterruptNotice $interruptNotice)
    {
        return response()->json(['data' => $interruptNotice->load(['operator', 'campus'])]);
    }

    public function broadcast(Request $request, InterruptNotice $interruptNotice)
    {
        if (!$interruptNotice->isPending()) {
            return response()->json(['message' => '只有待播出的通知可以播出'], 400);
        }

        $interruptNotice->markAsBroadcasted();

        return response()->json([
            'message' => '插播通知已标记为已播出',
            'data' => $interruptNotice->load(['operator', 'campus']),
        ]);
    }

    public function cancel(Request $request, InterruptNotice $interruptNotice)
    {
        if (!$interruptNotice->isPending()) {
            return response()->json(['message' => '只有待播出的通知可以取消'], 400);
        }

        $interruptNotice->cancel();

        return response()->json([
            'message' => '插播通知已取消',
            'data' => $interruptNotice->load(['operator', 'campus']),
        ]);
    }

    public function update(Request $request, InterruptNotice $interruptNotice)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'reason' => 'string',
            'schedule_time' => 'nullable|date',
            'status' => 'string|in:pending,broadcasted,cancelled',
            'operator_id' => 'nullable|exists:users,id',
            'campus_id' => 'nullable|exists:campuses,id',
        ]);

        $interruptNotice->update($validated);

        return response()->json([
            'message' => '临时插播通知更新成功',
            'data' => $interruptNotice->load(['operator', 'campus']),
        ]);
    }

    public function destroy(InterruptNotice $interruptNotice)
    {
        $interruptNotice->delete();

        return response()->json([
            'message' => '临时插播通知删除成功',
        ]);
    }
}
