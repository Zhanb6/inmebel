<?php

namespace App\Http\Resources\Workshop;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkshopWorkshopShowResource extends JsonResource
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
            'bic'=>$this->bic,
            'bank'=>$this->bank,
            'director_name'=>$this->director_name,
            'accepted_at'=>$this->accepted_at,
            'iic'=>$this->iic,
            'bc'=>$this->bc,
            'city'=>$this->city,
            'media'=>$this->getMedia()->toArray(),
        ];
    }
}
