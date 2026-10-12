<?php

namespace App\Http\Resources\UserClientData;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserClientDataAdminShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'iin'=>$this->iin,
            'address'=>$this->address,
        ];
    }
}
