<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::with('campus');

        if ($request->has('campus_id')) {
            $query->where('campus_id', $request->campus_id);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->keyword}%")
                    ->orWhere('brand', 'like', "%{$request->keyword}%")
                    ->orWhere('model', 'like', "%{$request->keyword}%");
            });
        }

        $equipment = $query->paginate($request->per_page ?? 15);

        return response()->json(['data' => $equipment]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'serial_number' => 'nullable|string|unique:equipment,serial_number',
            'status' => 'string|in:available,borrowed,maintenance',
            'campus_id' => 'nullable|exists:campuses,id',
            'purchase_date' => 'nullable|date',
        ]);

        $equipment = Equipment::create($validated);

        return response()->json([
            'message' => '设备创建成功',
            'data' => $equipment->load('campus'),
        ], 201);
    }

    public function show(Equipment $equipment)
    {
        return response()->json(['data' => $equipment->load(['campus', 'borrows'])]);
    }

    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'category' => 'string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'serial_number' => 'nullable|string|unique:equipment,serial_number,' . $equipment->id,
            'status' => 'string|in:available,borrowed,maintenance',
            'campus_id' => 'nullable|exists:campuses,id',
            'purchase_date' => 'nullable|date',
        ]);

        $equipment->update($validated);

        return response()->json([
            'message' => '设备更新成功',
            'data' => $equipment->load('campus'),
        ]);
    }

    public function destroy(Equipment $equipment)
    {
        if ($equipment->isBorrowed()) {
            return response()->json(['message' => '设备正在借用中，无法删除'], 400);
        }

        $equipment->delete();

        return response()->json([
            'message' => '设备删除成功',
        ]);
    }
}
