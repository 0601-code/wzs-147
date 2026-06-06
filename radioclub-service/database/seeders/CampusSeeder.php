<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Campus;

class CampusSeeder extends Seeder
{
    public function run(): void
    {
        $campuses = [
            ['name' => '主校区', 'address' => '北京市朝阳区学院路1号', 'status' => true],
            ['name' => '东校区', 'address' => '北京市海淀区中关村大街100号', 'status' => true],
            ['name' => '西校区', 'address' => '北京市西城区复兴门内大街50号', 'status' => true],
        ];

        foreach ($campuses as $campus) {
            Campus::create($campus);
        }
    }
}
