<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioMaterial;
use Illuminate\Http\Request;

class AudioMaterialController extends Controller
{
    public function index(Request $request)
    {
        $query = AudioMaterial::with(['column', 'uploader']);

        if ($request->has('column_id')) {
            $query->where('column_id', $request->column_id);
        }

        if ($request->has('uploader_id')) {
            $query->where('uploader_id', $request->uploader_id);
        }

        if ($request->has('file_type')) {
            $query->where('file_type', $request->file_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $materials = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['data' => $materials]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'file_path' => 'required|string',
            'file_type' => 'required|string',
            'duration' => 'nullable|integer',
            'column_id' => 'nullable|exists:columns,id',
            'uploader_id' => 'required|exists:users,id',
            'status' => 'boolean',
        ]);

        $material = AudioMaterial::create($validated);

        return response()->json([
            'message' => '音频素材创建成功',
            'data' => $material->load(['column', 'uploader']),
        ], 201);
    }

    public function show(AudioMaterial $audioMaterial)
    {
        return response()->json(['data' => $audioMaterial->load(['column', 'uploader'])]);
    }

    public function update(Request $request, AudioMaterial $audioMaterial)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'file_path' => 'string',
            'file_type' => 'string',
            'duration' => 'nullable|integer',
            'column_id' => 'nullable|exists:columns,id',
            'status' => 'boolean',
        ]);

        $audioMaterial->update($validated);

        return response()->json([
            'message' => '音频素材更新成功',
            'data' => $audioMaterial->load(['column', 'uploader']),
        ]);
    }

    public function destroy(AudioMaterial $audioMaterial)
    {
        $audioMaterial->delete();

        return response()->json([
            'message' => '音频素材删除成功',
        ]);
    }
}
