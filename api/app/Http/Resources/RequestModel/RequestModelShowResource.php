<?php

namespace App\Http\Resources\RequestModel;

use App\Http\Resources\FurnitureType\FurnitureTypeGeneralListResource;
use App\Http\Resources\General\IdNameResource;
use App\Http\Resources\RequestAddition\RequestAdditionShowResource;
use App\Http\Resources\RequestStatus\RequestStatusShowResource;
use App\Services\FurnitureService\Furniture\FurnitureFactory;
use App\Services\FurnitureService\FurnitureStatus\FurnitureStatusFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestModelShowResource extends JsonResource
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
            'address'=>$this->address,
            'description'=>$this->description,
            'price_from'=>$this->price_from,
            'price_to'=>$this->price_to,
            'price'=>$this->price,
            'workshop_id'=>$this->workshop_id,
            'workshop'=>new IdNameResource($this->workshop),
            'furniture_type'=>new FurnitureTypeGeneralListResource($this->furniture_type),
            'request_status'=>new RequestStatusShowResource($this->request_status),
            'request_status_id'=>$this->request_status_id,
            'created_at'=>$this->created_at,
            'furniture_data'=> FurnitureFactory::make($this->furniture_type_id)->show($this->furniture_data),
            'statuses'=>FurnitureStatusFactory::make($this->furniture_type_id)->show($this->resource),

            'client_name'=>$this->client_name,
            'client_iin'=>$this->client_iin,
            'client_phone'=>$this->client_phone,
            'client_address'=>$this->client_address,
            'additions'=>RequestAdditionShowResource::collection($this->request_additions)
        ];
    }
}
