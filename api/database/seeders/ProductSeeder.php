<?php

namespace Database\Seeders;

use App\Enums\AttributeTypeEnum;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        $attributes = Attribute::all();

        for ($i = 1; $i <= 30; $i++) {

            $data = Product::create([
                'workshop_id'=>1,
                'name'=>fake()->userName,
                'price'=>fake()->numberBetween(50000,1000000),
                'description'=>fake()->text,
            ]);

            $attributes->each(function (Attribute $attribute) use ($data) {
                if ($attribute->type == AttributeTypeEnum::SELECT->value){
                    $variants = $attribute->variants()->get();

                    $productAttribute = $data->attributes()->create([
                        'attribute_id'=>$attribute->id,
                    ]);

                    $productAttribute->variants()->sync($variants->pluck('id')->toArray());
                } else{

                    $productAttribute = $data->attributes()->create([
                        'attribute_id'=>$attribute->id,
                        'value'=>fake()->numberBetween(1,10),
                    ]);
                }

            });

            $data->categories()->attach(fake()->randomElement($categories->pluck('id')->toArray()));
        }


    }
}
