<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Column;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    public function index(Request $request)
    {
        $query = Column::with('campus');

        if ($request->has('campus_id')) {
            $query->where('campus_id', $request->campus_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $columns = $query->paginate($request->per_page ?? 15);

        return response()->json(['data' => $columns]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'broadcast_time' => 'nullable|string',
            'status' => 'boolean',
            'campus_id' => 'nullable|exists:campuses,id',
        ]);

        $column = Column::create($validated);

        return response()->json([
            'message' => '栏目创建成功',
            'data' => $column->load('campus'),
        ], 201);
    }

    public function show(Column $column)
    {
        return response()->json(['data' => $column->load('campus')]);
    }

    public function update(Request $request, Column $column)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'duration' => 'integer|min:1',
            'broadcast_time' => 'nullable|string',
            'status' => 'boolean',
            'campus_id' => 'nullable|exists:campuses,id',
        ]);

        $column->update($validated);

        return response()->json([
            'message' => '栏目更新成功',
            'data' => $column->load('campus'),
        ]);
    }

    public function destroy(Column $column)
    {
        $column->delete();

        return response()->json([
            'message' => '栏目删除成功',
        ]);
    }
}
