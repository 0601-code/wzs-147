<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use Illuminate\Http\Request;

class CampusController extends Controller
{
    public function index()
    {
        $campuses = Campus::all();
        return response()->json(['data' => $campuses]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $campus = Campus::create($validated);

        return response()->json([
            'message' => '校区创建成功',
            'data' => $campus,
        ], 201);
    }

    public function show(Campus $campus)
    {
        return response()->json(['data' => $campus]);
    }

    public function update(Request $request, Campus $campus)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'address' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $campus->update($validated);

        return response()->json([
            'message' => '校区更新成功',
            'data' => $campus,
        ]);
    }

    public function destroy(Campus $campus)
    {
        $campus->delete();

        return response()->json([
            'message' => '校区删除成功',
        ]);
    }
}
