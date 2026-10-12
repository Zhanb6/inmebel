<?php

namespace App\Http\Resources\RequestModel;

use App\Http\Resources\FurnitureSubtype\FurnitureSubtypeListResource;
use App\Http\Resources\FurnitureType\FurnitureTypeGeneralListResource;
use App\Http\Resources\General\IdNameResource;
use App\Http\Resources\RequestStatus\RequestStatusShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestModelResource extends JsonResource
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
            'client_name'=>$this->client_name,
            'client_iin'=>$this->client_iin,
            'client_phone'=>$this->client_phone,
            'client_address'=>$this->client_address,
            'price'=>$this->price,
            'workshop_id'=>$this->workshop_id,
            'workshop'=>new IdNameResource($this->workshop),
            'furniture_type'=>new FurnitureTypeGeneralListResource($this->furniture_type),
            'request_status'=>new RequestStatusShowResource($this->request_status),
            'created_at'=>$this->created_at,
        ];
    }
}
