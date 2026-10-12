<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\OrderProduct\OrderProductShowResource;
use App\Http\Resources\OrderStatus\OrderStatusShowResource;
use App\Http\Resources\Product\ProductShowResource;
use App\Http\Resources\Workshop\WorkshopGeneralShowResource;
use App\Http\Resources\Workshop\WorkshopWorkshopShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderIndexResource extends JsonResource
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
            'workshop'=>new WorkshopWorkshopShowResource($this->workshop),
            'order_status'=>new OrderStatusShowResource($this->status),
            'price'=>$this->price,
            'products'=>OrderProductShowResource::collection($this->products),
        ];
    }
}
