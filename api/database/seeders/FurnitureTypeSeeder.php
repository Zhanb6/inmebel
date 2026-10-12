<?php

namespace Database\Seeders;

use App\Models\FurnitureType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FurnitureTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = FurnitureType::create([
            'name' => 'Кухонный гарнитур',
            'percent_minus' => 10,
            'percent_plus' => 10,
        ]);

        $data->facades()->attach([
            1 => [
                'price' => 195000
            ],
            2 => [
                'price' => 224000
            ],
            3 => [
                'price' => 330000
            ],
            4 => [
                'price' => 287000
            ],
            5 => [
                'price' => 425000
            ],
        ]);

        $data = FurnitureType::create([
            'name' => 'Шкаф',
            'percent_minus' => 10,
            'percent_plus' => 10,
        ]);

        $data->facades()->attach([
            1 => [
                'price' => 75000
            ],
            2 => [
                'price' => 90000
            ],
            3 => [
                'price' => 120000
            ],
            4 => [
                'price' => 97000
            ],
            5 => [
                'price' => 207000
            ],
        ]);

        $data = FurnitureType::create([
            'name' => 'Тумба под раковину',
            'percent_minus' => 10,
            'percent_plus' => 10,
        ]);

        $data->facades()->attach([
            1 => [
                'price' => 75000
            ],
            2 => [
                'price' => 90000
            ],
            3 => [
                'price' => 120000
            ],
            4 => [
                'price' => 97000
            ],
            5 => [
                'price' => 207000
            ],
        ]);


        $data = FurnitureType::create([
            'name' => 'Гардероб',
            'percent_minus' => 10,
            'percent_plus' => 10,
        ]);

        FurnitureType::create([
            'name' => 'Зеркало',
            'percent_minus' => 10,
            'percent_plus' => 10,
        ]);
    }
}
