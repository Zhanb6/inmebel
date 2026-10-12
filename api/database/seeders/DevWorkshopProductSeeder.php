<?php

namespace Database\Seeders;

use App\Models\Workshop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DevWorkshopProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workshops = Workshop::all()->each(function (Workshop $workshop) {
            for ($i = 0; $i < 10; $i++) {
                $workshop->products()->create([
                    'name'=>fake()->name,
                    'price'=>fake()->numberBetween(100, 1000),
                ]);
            }
        });
    }
}
