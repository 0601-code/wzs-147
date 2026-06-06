<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use Illuminate\Http\Request;

class ManuscriptController extends Controller
{
    public function index(Request $request)
    {
        $query = Manuscript::with(['column', 'author', 'reviewer']);

        if ($request->has('column_id')) {
            $query->where('column_id', $request->column_id);
        }

        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $manuscripts = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['data' => $manuscripts]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'column_id' => 'nullable|exists:columns,id',
            'author_id' => 'required|exists:users,id',
            'status' => 'string|in:draft,submitted,approved,rejected',
        ]);

        $manuscript = Manuscript::create($validated);

        return response()->json([
            'message' => '稿件创建成功',
            'data' => $manuscript->load(['column', 'author', 'reviewer']),
        ], 201);
    }

    public function show(Manuscript $manuscript)
    {
        return response()->json(['data' => $manuscript->load(['column', 'author', 'reviewer'])]);
    }

    public function update(Request $request, Manuscript $manuscript)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'column_id' => 'nullable|exists:columns,id',
            'status' => 'string|in:draft,submitted,approved,rejected',
        ]);

        $manuscript->update($validated);

        return response()->json([
            'message' => '稿件更新成功',
            'data' => $manuscript->load(['column', 'author', 'reviewer']),
        ]);
    }

    public function submit(Request $request, Manuscript $manuscript)
    {
        if ($manuscript->status !== 'draft') {
            return response()->json(['message' => '只有草稿状态的稿件可以提交'], 400);
        }

        $manuscript->submit();

        return response()->json([
            'message' => '稿件提交成功',
            'data' => $manuscript->load(['column', 'author', 'reviewer']),
        ]);
    }

    public function approve(Request $request, Manuscript $manuscript)
    {
        $request->validate([
            'feedback' => 'nullable|string',
        ]);

        if ($manuscript->status !== 'submitted') {
            return response()->json(['message' => '只有待审核状态的稿件可以审批'], 400);
        }

        $manuscript->approve($request->user()->id, $request->feedback);

        return response()->json([
            'message' => '稿件审核通过',
            'data' => $manuscript->load(['column', 'author', 'reviewer']),
        ]);
    }

    public function reject(Request $request, Manuscript $manuscript)
    {
        $request->validate([
            'feedback' => 'required|string',
        ]);

        if ($manuscript->status !== 'submitted') {
            return response()->json(['message' => '只有待审核状态的稿件可以审批'], 400);
        }

        $manuscript->reject($request->user()->id, $request->feedback);

        return response()->json([
            'message' => '稿件已驳回',
            'data' => $manuscript->load(['column', 'author', 'reviewer']),
        ]);
    }

    public function destroy(Manuscript $manuscript)
    {
        $manuscript->delete();

        return response()->json([
            'message' => '稿件删除成功',
        ]);
    }
}
