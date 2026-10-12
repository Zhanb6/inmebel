<?php

namespace Database\Seeders;

use App\Enums\AttributeTypeEnum;
use App\Models\Attribute;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Attribute::create([
            'name'=>'Длина',
            'type'=>AttributeTypeEnum::INTEGER->value,
        ]);

        Attribute::create([
            'name'=>'Высота',
            'type'=>AttributeTypeEnum::INTEGER->value,
        ]);
        Attribute::create([
            'name'=>'Глубина',
            'type'=>AttributeTypeEnum::INTEGER->value,
        ]);


        $materials = Attribute::create([
            'name'=>'Материалы',
            'type'=>AttributeTypeEnum::SELECT->value,
        ]);

        $materials->variants()->create([
            'value'=>'Вариант 1',
        ]);

        $materials->variants()->create([
            'value'=>'Вариант 2',
        ]);

        $materials->variants()->create([
            'value'=>'Вариант 3',
        ]);
    }
}
