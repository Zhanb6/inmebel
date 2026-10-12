<?php

namespace App\Http\Resources\OrderProduct;

use App\Http\Resources\Product\ProductShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderProductShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $mainData = new ProductShowResource($this->resource);
        $mainData = $mainData->jsonSerialize();

        $mainData['pivot'] = [
            'price'=>$this->pivot?->price,
            'quantity'=>$this->pivot?->quantity,
        ];


        return $mainData;

    }
}
