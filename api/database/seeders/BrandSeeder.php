<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Brand::create([
            'name'=>'GTV',
            'percentage'=>50
        ]);

        Brand::create([
            'name'=>'Boyard',
            'percentage'=>7
        ]);

        Brand::create([
            'name'=>'Hettich',
            'percentage'=>12
        ]);

        Brand::create([
            'name'=>'Blum',
            'percentage'=>15
        ]);
    }
}
