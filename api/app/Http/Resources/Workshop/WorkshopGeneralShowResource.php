<?php

namespace App\Http\Resources\Workshop;

use App\Http\Resources\Review\ReviewShowResource;
use App\Http\Resources\WorkshopPriceList\WorkshopPriceListGeneralShowResource;
use App\Http\Resources\WorkshoReview\WorkshopReviewGeneralShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkshopGeneralShowResource extends JsonResource
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
            'iin'=>$this->iin,
            'address'=>$this->address,
            'description'=>$this->description,
            'media'=>$this->getMedia()->toArray(),
            'price_lists'=>WorkshopPriceListGeneralShowResource::collection($this->price_lists),
            'reviews'=>ReviewShowResource::collection($this->reviews),
        ];
    }
}
