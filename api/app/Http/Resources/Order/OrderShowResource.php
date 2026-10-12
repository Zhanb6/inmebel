<?php

namespace App\Http\Resources\Order;

use App\Http\Resources\OrderProduct\OrderProductShowResource;
use App\Http\Resources\OrderStatus\OrderStatusShowResource;
use App\Http\Resources\Workshop\WorkshopWorkshopShowResource;
use App\Services\FurnitureService\FurnitureStatus\FurnitureStatusFactory;
use App\Services\OrderService\OrderStatusService\OrderStatusBase;
use App\Services\OrderService\OrderStatusService\OrderStatusService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderShowResource extends JsonResource
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
            'statuses'=>OrderStatusService::show($this->resource)

        ];
    }
}
