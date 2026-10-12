<?php

namespace Database\Seeders;

use App\Enums\FurnitureTypeEnum;
use App\Models\FurnitureTypePrice;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FurnitureTypePriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>1,
            'frame_id'=>1,
            'price'=>190000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>2,
            'frame_id'=>1,
            'price'=>210000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>2,
            'frame_id'=>2,
            'price'=>227000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>4,
            'frame_id'=>1,
            'price'=>295000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>4,
            'frame_id'=>2,
            'price'=>315000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>3,
            'frame_id'=>1,
            'price'=>346000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>3,
            'frame_id'=>2,
            'price'=>366000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>5,
            'frame_id'=>1,
            'price'=>425000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'facade_id'=>5,
            'frame_id'=>2,
            'price'=>445000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>1,
            'frame_id'=>1,
            'price'=>79000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>2,
            'frame_id'=>1,
            'price'=>96000,
        ]);
        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>2,
            'frame_id'=>2,
            'price'=>112000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>4,
            'frame_id'=>1,
            'price'=>115000,
        ]);
        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>4,
            'frame_id'=>2,
            'price'=>127000,
        ]);


        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>3,
            'frame_id'=>1,
            'price'=>130000,
        ]);
        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>3,
            'frame_id'=>2,
            'price'=>145000,
        ]);


        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>5,
            'frame_id'=>1,
            'price'=>180000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'facade_id'=>5,
            'frame_id'=>2,
            'price'=>199000,
        ]);



        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>1,
            'frame_id'=>1,
            'price'=>79000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>2,
            'frame_id'=>1,
            'price'=>96000,
        ]);
        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>2,
            'frame_id'=>2,
            'price'=>112000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>4,
            'frame_id'=>1,
            'price'=>115000,
        ]);
        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>4,
            'frame_id'=>2,
            'price'=>127000,
        ]);


        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>3,
            'frame_id'=>1,
            'price'=>130000,
        ]);
        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>3,
            'frame_id'=>2,
            'price'=>145000,
        ]);


        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>5,
            'frame_id'=>1,
            'price'=>180000,
        ]);

        FurnitureTypePrice::create([
            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
            'facade_id'=>5,
            'frame_id'=>2,
            'price'=>199000,
        ]);




    }
}
