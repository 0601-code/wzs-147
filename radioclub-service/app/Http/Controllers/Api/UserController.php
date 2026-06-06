<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('campus');

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('campus_id')) {
            $query->where('campus_id', $request->campus_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->keyword}%")
                    ->orWhere('email', 'like', "%{$request->keyword}%");
            });
        }

        $users = $query->paginate($request->per_page ?? 15);

        return response()->json(['data' => $users]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:teacher,anchor,equipment_admin',
            'campus_id' => 'nullable|exists:campuses,id',
            'phone' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => '用户创建成功',
            'data' => $user->load('campus'),
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json(['data' => $user->load('campus')]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'in:teacher,anchor,equipment_admin',
            'campus_id' => 'nullable|exists:campuses,id',
            'phone' => 'nullable|string',
            'status' => 'boolean',
        ]);

        if ($request->has('password')) {
            $request->validate(['password' => 'string|min:6']);
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return response()->json([
            'message' => '用户更新成功',
            'data' => $user->load('campus'),
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => '用户删除成功',
        ]);
    }
}
