<?php

namespace Database\Seeders;

use App\Enums\FurnitureTypeEnum;
use App\Models\FurnitureType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FurnitureTypeFurnitureAddonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $furnitureType = FurnitureType::find(FurnitureTypeEnum::KITCHEN->value);

        $furnitureType->addons()->sync([1, 2, 3, 4, 5]);

        $furnitureType = FurnitureType::find(FurnitureTypeEnum::CLOSET->value);

        $furnitureType->addons()->sync([1,6,7,8,9,10]);

        $furnitureType = FurnitureType::find(FurnitureTypeEnum::WARDROBE->value);

        $furnitureType->addons()->sync([1,6,7,8,9,10]);
    }
}
