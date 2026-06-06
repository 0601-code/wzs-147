<?php

namespace App\Http\Requests\Manuscript;

use App\Http\Requests\BaseRequest;

class StoreManuscriptRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'column_id' => 'nullable|exists:columns,id',
            'author_id' => 'required|exists:users,id',
            'status' => 'string|in:draft,submitted,approved,rejected',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => '请输入稿件标题',
            'content.required' => '请输入稿件内容',
            'author_id.required' => '请选择作者',
            'author_id.exists' => '作者不存在',
        ];
    }
}
