<?php

namespace Database\Seeders;

use App\Models\Filling;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FillingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Filling::create([
            'name'=>'Выдвижной ящик'
        ]);

    }
}
