<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => '张老师',
                'email' => 'teacher@example.com',
                'password' => Hash::make('123456'),
                'role' => 'teacher',
                'campus_id' => 1,
                'phone' => '13800138001',
                'status' => true,
            ],
            [
                'name' => '李老师',
                'email' => 'teacher2@example.com',
                'password' => Hash::make('123456'),
                'role' => 'teacher',
                'campus_id' => 2,
                'phone' => '13800138002',
                'status' => true,
            ],
            [
                'name' => '王小明',
                'email' => 'anchor1@example.com',
                'password' => Hash::make('123456'),
                'role' => 'anchor',
                'campus_id' => 1,
                'phone' => '13900139001',
                'status' => true,
            ],
            [
                'name' => '刘小红',
                'email' => 'anchor2@example.com',
                'password' => Hash::make('123456'),
                'role' => 'anchor',
                'campus_id' => 1,
                'phone' => '13900139002',
                'status' => true,
            ],
            [
                'name' => '陈小刚',
                'email' => 'anchor3@example.com',
                'password' => Hash::make('123456'),
                'role' => 'anchor',
                'campus_id' => 2,
                'phone' => '13900139003',
                'status' => true,
            ],
            [
                'name' => '赵管理员',
                'email' => 'admin@example.com',
                'password' => Hash::make('123456'),
                'role' => 'equipment_admin',
                'campus_id' => 1,
                'phone' => '13700137001',
                'status' => true,
            ],
            [
                'name' => '孙管理员',
                'email' => 'admin2@example.com',
                'password' => Hash::make('123456'),
                'role' => 'equipment_admin',
                'campus_id' => 2,
                'phone' => '13700137002',
                'status' => true,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
