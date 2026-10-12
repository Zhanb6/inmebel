<?php

namespace App\Http\Resources\Cart;

use App\Http\Resources\Product\ProductIndexResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemShowResource extends JsonResource
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
            'price_product'=>$this->price_product,
            'price_result'=>$this->price_result,
            'quantity'=>$this->quantity,
            'product'=>new ProductIndexResource($this->product),
        ];
    }
}
