<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\EquipmentBorrow;
use Illuminate\Http\Request;

class EquipmentBorrowController extends Controller
{
    public function index(Request $request)
    {
        $query = EquipmentBorrow::with(['equipment', 'borrower']);

        if ($request->has('equipment_id')) {
            $query->where('equipment_id', $request->equipment_id);
        }

        if ($request->has('borrower_id')) {
            $query->where('borrower_id', $request->borrower_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('borrow_date')) {
            $query->whereDate('borrow_date', $request->borrow_date);
        }

        $borrows = $query->orderBy('borrow_date', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['data' => $borrows]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'borrower_id' => 'required|exists:users,id',
            'borrower_name' => 'required|string',
            'borrow_date' => 'required|date',
            'expected_return_date' => 'required|date|after:borrow_date',
            'purpose' => 'nullable|string',
        ]);

        $equipment = Equipment::find($validated['equipment_id']);

        if (!$equipment->isAvailable()) {
            return response()->json(['message' => '设备当前不可用'], 400);
        }

        $borrow = EquipmentBorrow::create(array_merge($validated, [
            'status' => 'borrowed',
        ]));

        $equipment->markAsBorrowed();

        return response()->json([
            'message' => '设备借用成功',
            'data' => $borrow->load(['equipment', 'borrower']),
        ], 201);
    }

    public function show(EquipmentBorrow $equipmentBorrow)
    {
        return response()->json(['data' => $equipmentBorrow->load(['equipment', 'borrower'])]);
    }

    public function returnEquipment(Request $request, EquipmentBorrow $equipmentBorrow)
    {
        $request->validate([
            'return_check_note' => 'nullable|string',
        ]);

        if (!$equipmentBorrow->isBorrowed() && !$equipmentBorrow->isOverdue()) {
            return response()->json(['message' => '该设备借用记录无法归还'], 400);
        }

        $equipmentBorrow->returnEquipment($request->return_check_note);

        return response()->json([
            'message' => '设备归还成功',
            'data' => $equipmentBorrow->load(['equipment', 'borrower']),
        ]);
    }

    public function update(Request $request, EquipmentBorrow $equipmentBorrow)
    {
        $validated = $request->validate([
            'expected_return_date' => 'date|after:borrow_date',
            'purpose' => 'nullable|string',
        ]);

        $equipmentBorrow->update($validated);

        return response()->json([
            'message' => '借用记录更新成功',
            'data' => $equipmentBorrow->load(['equipment', 'borrower']),
        ]);
    }

    public function destroy(EquipmentBorrow $equipmentBorrow)
    {
        if ($equipmentBorrow->isBorrowed() || $equipmentBorrow->isOverdue()) {
            return response()->json(['message' => '借用中的记录不能删除'], 400);
        }

        $equipmentBorrow->delete();

        return response()->json([
            'message' => '借用记录删除成功',
        ]);
    }
}
