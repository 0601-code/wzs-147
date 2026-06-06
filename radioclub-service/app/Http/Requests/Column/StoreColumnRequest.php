<?php

namespace App\Http\Requests\Column;

use App\Http\Requests\BaseRequest;

class StoreColumnRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'broadcast_time' => 'nullable|string',
            'status' => 'boolean',
            'campus_id' => 'nullable|exists:campuses,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => '请输入栏目名称',
            'duration.required' => '请输入播出时长',
            'duration.integer' => '播出时长必须是整数',
            'duration.min' => '播出时长不能少于1分钟',
        ];
    }
}
