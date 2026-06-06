<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Column;

class ColumnSeeder extends Seeder
{
    public function run(): void
    {
        $columns = [
            [
                'name' => '早间新闻',
                'description' => '播报国内外重要新闻、校园动态，让同学们在清晨第一时间了解天下事。',
                'duration' => 30,
                'broadcast_time' => '07:30',
                'status' => true,
                'campus_id' => 1,
            ],
            [
                'name' => '午间音乐',
                'description' => '精选流行音乐和经典老歌，为午休时光增添惬意氛围。',
                'duration' => 45,
                'broadcast_time' => '12:00',
                'status' => true,
                'campus_id' => 1,
            ],
            [
                'name' => '午后书香',
                'description' => '推荐优秀书籍，分享读书心得，营造校园书香氛围。',
                'duration' => 20,
                'broadcast_time' => '14:00',
                'status' => true,
                'campus_id' => 1,
            ],
            [
                'name' => '晚间访谈',
                'description' => '邀请校园名人、优秀学长学姐进行访谈，分享成长故事。',
                'duration' => 40,
                'broadcast_time' => '18:00',
                'status' => true,
                'campus_id' => 1,
            ],
            [
                'name' => '英语角',
                'description' => '英语学习节目，提升同学们的英语听力和口语水平。',
                'duration' => 25,
                'broadcast_time' => '19:00',
                'status' => true,
                'campus_id' => 1,
            ],
            [
                'name' => '体育风云',
                'description' => '播报最新体育赛事资讯，传递体育精神。',
                'duration' => 30,
                'broadcast_time' => '17:00',
                'status' => true,
                'campus_id' => 1,
            ],
            [
                'name' => '东校区早播报',
                'description' => '东校区专属早间节目，播报校区新闻和通知。',
                'duration' => 25,
                'broadcast_time' => '07:45',
                'status' => true,
                'campus_id' => 2,
            ],
            [
                'name' => '东校区午间时光',
                'description' => '东校区午间音乐和故事分享节目。',
                'duration' => 40,
                'broadcast_time' => '12:15',
                'status' => true,
                'campus_id' => 2,
            ],
            [
                'name' => '西校区新闻速递',
                'description' => '西校区新闻资讯节目。',
                'duration' => 20,
                'broadcast_time' => '08:00',
                'status' => false,
                'campus_id' => 3,
            ],
        ];

        foreach ($columns as $column) {
            Column::create($column);
        }
    }
}
