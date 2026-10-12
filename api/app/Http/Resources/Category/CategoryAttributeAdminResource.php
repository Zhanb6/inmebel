<?php

namespace App\Http\Resources\Category;

use App\Http\Resources\General\IdNameResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryAttributeAdminResource extends JsonResource
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
            'name'=>$this->name,
            'type'=>$this->type,
            'variants'=>$this->variants->map(function ($variant) {
                $item['id'] = $variant->id;
                $item['value'] = $variant->value;


                return $item;
            }),
        ];
    }
}
