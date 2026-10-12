<?php

namespace Database\Seeders;

use App\Enums\FurnitureSubtypeDataTypeEnum;
use App\Enums\FurnitureTypeEnum;
use App\Models\FurnitureSubtype;
use Illuminate\Database\Seeder;

class FurnitureSubtypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        FurnitureSubtype::create([
            'name'=>'Прямая кухня',
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::KITCHEN_LINEAR->value,
        ]);

        FurnitureSubtype::create([
            'name'=>'Угловая кухня',
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::CORNER->value,
        ]);

        FurnitureSubtype::create([
            'name'=>'П образная кухня',
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::P_FORM->value,
        ]);

        FurnitureSubtype::create([
            'name'=>'Только нижние модуля',
            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::LOWER_MODULE->value,
        ]);

//        FurnitureSubtype::create([
//            'name'=>'П-образная',
//            'furniture_type_id'=>FurnitureTypeEnum::KITCHEN->value,
//        ]);


        FurnitureSubtype::create([
            'name'=>'Распашной',
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::CLOSET_SWING->value,
        ]);

        FurnitureSubtype::create([
            'name'=>'Купе',
            'furniture_type_id'=>FurnitureTypeEnum::CLOSET->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::CLOSET_SLIDING->value,
        ]);

        FurnitureSubtype::create([
            'name'=>'Прямой',
            'furniture_type_id'=>FurnitureTypeEnum::WARDROBE->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::WARDROBE_LINEAR_FORM->value,
        ]);

        FurnitureSubtype::create([
            'name'=>'Г - образный',
            'furniture_type_id'=>FurnitureTypeEnum::WARDROBE->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::WARDROBE_G_FORM->value,
        ]);

        FurnitureSubtype::create([
            'name'=>'П - образный',
            'furniture_type_id'=>FurnitureTypeEnum::WARDROBE->value,
            'data_type'=>FurnitureSubtypeDataTypeEnum::WARDROBE_P_FORM->value,
        ]);
//
//
//        FurnitureSubtype::create([
//            'name'=>'Форма 1',
//            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
//
//        ]);
//        FurnitureSubtype::create([
//            'name'=>'Форма 2',
//            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
//        ]);
//        FurnitureSubtype::create([
//            'name'=>'Форма 3',
//            'furniture_type_id'=>FurnitureTypeEnum::CONSOLE_TABLE->value,
//        ]);
//
//
//        FurnitureSubtype::create([
//            'name'=>'Прямой',
//            'furniture_type_id'=>FurnitureTypeEnum::WARDROBE->value,
//
//        ]);
//        FurnitureSubtype::create([
//            'name'=>'Г - образный',
//            'furniture_type_id'=>FurnitureTypeEnum::WARDROBE->value,
//        ]);
//        FurnitureSubtype::create([
//            'name'=>'П- образный',
//            'furniture_type_id'=>FurnitureTypeEnum::WARDROBE->value,
//        ]);
    }
}
