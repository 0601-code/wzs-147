<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Equipment;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        $equipment = [
            [
                'name' => '专业广播调音台',
                'category' => '音频设备',
                'brand' => 'Yamaha',
                'model' => 'MG16XU',
                'serial_number' => 'EQ-2024-001',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-09-01',
            ],
            [
                'name' => '无线手持话筒',
                'category' => '音频设备',
                'brand' => 'Shure',
                'model' => 'SM58',
                'serial_number' => 'EQ-2024-002',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-09-01',
            ],
            [
                'name' => '无线手持话筒',
                'category' => '音频设备',
                'brand' => 'Shure',
                'model' => 'SM58',
                'serial_number' => 'EQ-2024-003',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-09-01',
            ],
            [
                'name' => '监听耳机',
                'category' => '音频设备',
                'brand' => 'Sony',
                'model' => 'MDR-7506',
                'serial_number' => 'EQ-2024-004',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-10-15',
            ],
            [
                'name' => '监听耳机',
                'category' => '音频设备',
                'brand' => 'Sony',
                'model' => 'MDR-7506',
                'serial_number' => 'EQ-2024-005',
                'status' => 'maintenance',
                'campus_id' => 1,
                'purchase_date' => '2023-10-15',
            ],
            [
                'name' => '专业录音麦克风',
                'category' => '音频设备',
                'brand' => 'Rode',
                'model' => 'NT1-A',
                'serial_number' => 'EQ-2024-006',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2024-01-10',
            ],
            [
                'name' => '便携式录音机',
                'category' => '录音设备',
                'brand' => 'Zoom',
                'model' => 'H6',
                'serial_number' => 'EQ-2024-007',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-11-20',
            ],
            [
                'name' => '便携式录音机',
                'category' => '录音设备',
                'brand' => 'Tascam',
                'model' => 'DR-40X',
                'serial_number' => 'EQ-2024-008',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-11-20',
            ],
            [
                'name' => '有源监听音箱',
                'category' => '音频设备',
                'brand' => 'KRK',
                'model' => 'Rokit 5',
                'serial_number' => 'EQ-2024-009',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-08-25',
            ],
            [
                'name' => '笔记本电脑',
                'category' => '计算机设备',
                'brand' => 'Apple',
                'model' => 'MacBook Pro 14',
                'serial_number' => 'EQ-2024-010',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2023-09-05',
            ],
            [
                'name' => '专业广播调音台',
                'category' => '音频设备',
                'brand' => 'Mackie',
                'model' => 'ProFX12v3',
                'serial_number' => 'EQ-2024-011',
                'status' => 'available',
                'campus_id' => 2,
                'purchase_date' => '2023-09-10',
            ],
            [
                'name' => '无线手持话筒套装',
                'category' => '音频设备',
                'brand' => 'Sennheiser',
                'model' => 'EW 135P G4',
                'serial_number' => 'EQ-2024-012',
                'status' => 'available',
                'campus_id' => 2,
                'purchase_date' => '2023-09-10',
            ],
            [
                'name' => '便携式采访机',
                'category' => '录音设备',
                'brand' => 'Olympus',
                'model' => 'LS-P4',
                'serial_number' => 'EQ-2024-013',
                'status' => 'available',
                'campus_id' => 2,
                'purchase_date' => '2023-12-01',
            ],
            [
                'name' => '摄像机',
                'category' => '视频设备',
                'brand' => 'Canon',
                'model' => 'XA50',
                'serial_number' => 'EQ-2024-014',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2024-02-15',
            ],
            [
                'name' => '三脚架',
                'category' => '辅助设备',
                'brand' => 'Manfrotto',
                'model' => 'MT055XPRO3',
                'serial_number' => 'EQ-2024-015',
                'status' => 'available',
                'campus_id' => 1,
                'purchase_date' => '2024-02-15',
            ],
        ];

        foreach ($equipment as $item) {
            Equipment::create($item);
        }
    }
}
