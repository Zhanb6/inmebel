<?php

namespace App\Http\Resources\FurnitureAddon;

use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FurnitureAddonShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return FurnitureAddonFactory::make($this->addon_data_type)->show($this->addon_data);
    }
}
