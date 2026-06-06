<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class LoginRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => '请输入邮箱',
            'email.email' => '请输入有效的邮箱地址',
            'password.required' => '请输入密码',
        ];
    }
}
