<?php

namespace App\Http\Resources\Workshop;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkshopGeneralIndexResource extends JsonResource
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
        ];
    }
}
