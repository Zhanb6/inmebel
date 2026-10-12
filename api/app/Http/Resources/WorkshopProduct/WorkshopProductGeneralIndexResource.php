<?php

namespace App\Http\Resources\WorkshopProduct;

use App\Http\Resources\Review\ReviewShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkshopProductGeneralIndexResource extends JsonResource
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
            'price'=>$this->price,
            'description'=>$this->description,
            'media'=>$this->getMedia()->toArray(),
            'created_at'=>$this->created_at,
            'reviews'=>ReviewShowResource::collection($this->reviews),
        ];
    }
}
