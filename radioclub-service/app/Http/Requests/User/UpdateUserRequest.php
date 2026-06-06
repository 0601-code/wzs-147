<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class UpdateUserRequest extends BaseRequest
{
    public function rules(): array
    {
        $userId = $this->route('user')->id ?? null;

        return [
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:6',
            'role' => 'in:teacher,anchor,equipment_admin',
            'campus_id' => 'nullable|exists:campuses,id',
            'phone' => 'nullable|string',
            'status' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => '请输入有效的邮箱地址',
            'email.unique' => '该邮箱已被注册',
            'password.min' => '密码长度不能少于6位',
            'role.in' => '角色值无效',
        ];
    }
}
