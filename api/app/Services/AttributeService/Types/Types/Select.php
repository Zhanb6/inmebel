<?php

namespace App\Services\AttributeService\Types\Types;

use App\Enums\AttributeTypeEnum;
use App\Models\Attribute;
use App\Models\AttributeVariant;
use App\Models\FurnitureAddon;
use App\Models\Product;
use App\Services\AttributeService\Types\AttributeBase;
use Illuminate\Validation\Rule;

class Select extends AttributeBase
{
    public static $type = AttributeTypeEnum::SELECT;


    public function rules():array
    {

        return [
            'id'=>['required','integer',Rule::exists(Attribute::class,'id')->where(function ($query) {
                $query->where('type', static::$type->value);
            }),],
            'attribute_variant_ids'=>'required|array|min:1',
            'attribute_variant_ids.*'=>['required','integer',Rule::exists(AttributeVariant::class,'id')->where(function ($query) {
                $query->where('attribute_id', $this->data['id']);
            }),],

        ];
    }

    public function saveToProduct(Product $product)
    {

        $attribute = $product->attributes()->create([
            'attribute_id' => $this->data['id'],
        ]);

        $attribute->variants()->sync($this->data['attribute_variant_ids']);
    }
}
