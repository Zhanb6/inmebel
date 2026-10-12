<?php

namespace App\Http\Resources\Product;

use App\Models\AttributeVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductAttributeShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'attribute_id'=>$this->attribute_id,
            'attribute'=>$this->attribute?->name,
            'attribute_type'=>$this->attribute?->type,
            'value'=>$this->value,
            'variants'=>$this->variants->map(function ($variant) {
                $newItem['id'] = $variant->id;
                $newItem['value'] = $variant->value;

                return $newItem;
            }),
        ];
    }
}
