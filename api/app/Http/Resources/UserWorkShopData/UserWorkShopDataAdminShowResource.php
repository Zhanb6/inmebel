<?php

namespace App\Http\Resources\UserWorkShopData;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserWorkShopDataAdminShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'accepted_at'=>$this->accepted_at,
            'name'=>$this->name,
            'iin'=>$this->iin,
            'address'=>$this->address,
            'media'=>$this->getMedia(),
        ];
    }
}
