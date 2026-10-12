<?php

namespace App\Http\Resources\RequestAddition;

use App\Http\Resources\FurnitureType\FurnitureTypeGeneralListResource;
use App\Http\Resources\General\IdNameResource;
use App\Http\Resources\RequestStatus\RequestStatusShowResource;
use App\Services\FurnitureService\Furniture\FurnitureFactory;
use App\Services\FurnitureService\FurnitureStatus\FurnitureStatusFactory;
use App\Services\OrderService\OrderStatusService\OrderStatusService;
use App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatusService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestAdditionShowResource extends JsonResource
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
            'number'=>$this->number,
            'price'=>$this->price,
            'furniture_type'=>new FurnitureTypeGeneralListResource($this->furniture_type),
            'request_addition_status'=>new RequestStatusShowResource($this->request_addition_status),
            'request_addition_status_id'=>$this->request_addition_status_id,
            'created_at'=>$this->created_at,
            'furniture_data'=> FurnitureFactory::make($this->furniture_type_id)->show($this->furniture_data),
            'statuses'=>RequestAdditionStatusService::show($this->resource)
        ];
    }
}
