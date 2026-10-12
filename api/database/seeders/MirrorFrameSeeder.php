<?php

namespace Database\Seeders;

use App\Models\MirrorFrame;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MirrorFrameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MirrorFrame::create([
            'name'=>'Рамка МДФ в пленке',
            'price'=>35000,
        ]);
        MirrorFrame::create([
            'name'=>'Рамка МДФ в краске',
            'price'=>55000,
        ]);
        MirrorFrame::create([
            'name'=>'Алюминевый профиль',
            'price'=>55000,
        ]);
    }
}
