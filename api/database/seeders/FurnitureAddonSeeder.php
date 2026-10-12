<?php

namespace Database\Seeders;

use App\Enums\FurnitureAddonDataTypeEnum;
use App\Models\FurnitureAddon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FurnitureAddonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FurnitureAddon::create([
            'name'=>'Подсветка',
            'price'=>35000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Бутылочница',
            'price'=>35000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Бокс для приборов',
            'price'=>75000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Сушка бизнес',
            'price'=>25000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Мойка',
            'price'=>35000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Зеркало',
            'price'=>25000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Брючница',
            'price'=>75000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Корзина для белья',
            'price'=>60000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Встроенная гладильная доска',
            'price'=>75000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);

        FurnitureAddon::create([
            'name'=>'Пантограф',
            'price'=>60000,
            'data_type'=>FurnitureAddonDataTypeEnum::PLUS_RULE->value,
        ]);


    }
}
