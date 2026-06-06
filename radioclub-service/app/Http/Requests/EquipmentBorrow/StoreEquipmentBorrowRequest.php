<?php

namespace App\Http\Requests\EquipmentBorrow;

use App\Http\Requests\BaseRequest;

class StoreEquipmentBorrowRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'equipment_id' => 'required|exists:equipment,id',
            'borrower_id' => 'required|exists:users,id',
            'borrower_name' => 'required|string',
            'borrow_date' => 'required|date',
            'expected_return_date' => 'required|date|after:borrow_date',
            'purpose' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'equipment_id.required' => '请选择设备',
            'equipment_id.exists' => '设备不存在',
            'borrower_id.required' => '请选择借用人',
            'borrower_id.exists' => '借用人不存在',
            'borrower_name.required' => '请输入借用人姓名',
            'borrow_date.required' => '请选择借用日期',
            'expected_return_date.required' => '请选择预计归还日期',
            'expected_return_date.after' => '预计归还日期必须在借用日期之后',
        ];
    }
}
