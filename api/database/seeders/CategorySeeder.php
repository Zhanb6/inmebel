<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = Attribute::all();

        $kitchen = Category::create([
            'name'=>'Кухонный гарнитур'
        ]);

        Category::create([
            'name'=>'Стулья',
            'parent_category_id'=>$kitchen->id
        ]);

        Category::create([
            'name'=>'Обеденные столы',
            'parent_category_id'=>$kitchen->id
        ]);

        Category::create([
            'name'=>'Кухонные уголки',
            'parent_category_id'=>$kitchen->id
        ]);
        Category::create([
            'name'=>'Кухонные столешницы',
            'parent_category_id'=>$kitchen->id
        ]);
        $kitchen->attributes()->sync($attributes->pluck('id')->toArray());

        $kitchen = Category::create([
            'name'=>'Спальная'
        ]);

        Category::create([
            'name'=>'Шкафы для одежды',
            'parent_category_id'=>$kitchen->id
        ]);

        Category::create([
            'name'=>'Тумбы прикроватная',
            'parent_category_id'=>$kitchen->id
        ]);

        $kitchen->attributes()->sync($attributes->pluck('id')->toArray());


        $kitchen = Category::create([
            'name'=>'Офис и кабинет'
        ]);

        Category::create([
            'name'=>'Компьютерные и офисные кресла',
            'parent_category_id'=>$kitchen->id
        ]);

        Category::create([
            'name'=>'Офисные тумбы',
            'parent_category_id'=>$kitchen->id
        ]);

        Category::create([
            'name'=>'Комплекты офисной мебели',
            'parent_category_id'=>$kitchen->id
        ]);

        $kitchen->attributes()->sync($attributes->pluck('id')->toArray());


    }
}
