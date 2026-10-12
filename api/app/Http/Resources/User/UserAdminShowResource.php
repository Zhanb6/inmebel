<?php

namespace App\Http\Resources\User;

use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserAdminShowResource extends JsonResource
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
            'phone'=>$this->phone,
            'roles'=>$this->roles?->pluck('name')->map(function ($item){
                return RoleEnum::tryFrom($item)?->getName();
            })->toArray(),
            'created_at'=>$this->created_at
        ];
    }
}
