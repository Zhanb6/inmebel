<?php

namespace Database\Seeders;

use App\Enums\FurnitureTypeEnum;
use App\Models\FurnitureType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FurnitureTypeBrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $furnitureType = FurnitureType::find(FurnitureTypeEnum::KITCHEN->value);

        $furnitureType->brands()->sync([
            1=>['percentage' => 5],
            2=>['percentage' => 7],
            3=>['percentage' => 12],
            4=>['percentage' => 15],
        ]);

        $furnitureType = FurnitureType::find(FurnitureTypeEnum::CLOSET->value);

        $furnitureType->brands()->sync([
            1=>['percentage' => 5],
            2=>['percentage' => 7],
            3=>['percentage' => 12],
            4=>['percentage' => 15],
        ]);

        $furnitureType = FurnitureType::find(FurnitureTypeEnum::WARDROBE->value);

        $furnitureType->brands()->sync([
            1=>['percentage' => 3],
            2=>['percentage' => 5],
            3=>['percentage' => 7],
            4=>['percentage' => 10],
        ]);

        $furnitureType = FurnitureType::find(FurnitureTypeEnum::CONSOLE_TABLE->value);

        $furnitureType->brands()->sync([
            1=>['percentage' => 5],
            2=>['percentage' => 7],
            3=>['percentage' => 12],
            4=>['percentage' => 15],
        ]);
    }
}
