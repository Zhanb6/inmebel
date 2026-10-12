<?php

namespace Database\Seeders;

use App\Models\MirrorBacklight;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MirrorBacklightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MirrorBacklight::create([
            'name'=>'Без подсветки',
        ]);

        MirrorBacklight::create([
            'name'=>'Обычная подсветка',
        ]);

        MirrorBacklight::create([
            'name'=>'Теневая подсветка',
        ]);
    }
}
