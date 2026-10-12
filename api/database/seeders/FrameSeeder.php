<?php

namespace Database\Seeders;

use App\Models\Frame;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FrameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Frame::create([
            'name'=>'ЛДСП Россия',
            'price'=>63000,
        ]);
        Frame::create([
            'name'=>'ЛДСП Egger',
            'price'=>75000,
        ]);
    }
}
