<?php

namespace App\Services\AttributeService\Types\Types;

use App\Enums\AttributeTypeEnum;
use App\Models\Attribute;
use App\Models\FurnitureAddon;
use App\Models\Product;
use App\Services\AttributeService\Types\AttributeBase;
use Illuminate\Validation\Rule;

class Text extends AttributeBase
{
    public static $type = AttributeTypeEnum::TEXT;


    public function rules():array
    {

        return [
            'id'=>['required','integer',Rule::exists(Attribute::class,'id')->where(function ($query) {
                $query->where('type', static::$type->value);
            }),],
            'value'=>'required|string',

        ];
    }

    public function saveToProduct(Product $product)
    {
        $attribute = $product->attributes()->create([
            'attribute_id' => $this->data['id'],
            'value' => $this->data['value'],
        ]);
    }
}
