<?php

namespace App\Http\Resources\Facade;

use App\Http\Resources\FacadeColor\FacadeColorList;
use App\Http\Resources\FacadeType\FacadeTypeList;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacadeListResource extends JsonResource
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
            'types'=>FacadeTypeList::collection($this->types),
            'colors'=>FacadeColorList::collection($this->colors),
        ];
    }
}
