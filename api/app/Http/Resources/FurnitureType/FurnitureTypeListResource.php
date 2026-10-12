<?php

namespace App\Http\Resources\FurnitureType;

use App\Http\Resources\Brand\BrandListResource;
use App\Http\Resources\FurnitureAddon\FurnitureAddonListResource;
use App\Http\Resources\FurnitureSubtype\FurnitureSubtypeListResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FurnitureTypeListResource extends JsonResource
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
            'subtypes'=>FurnitureSubtypeListResource::collection($this?->subtypes),
            'brands'=>BrandListResource::collection($this?->brands),
            'addons'=>FurnitureAddonListResource::collection($this?->addons),
        ];
    }
}
