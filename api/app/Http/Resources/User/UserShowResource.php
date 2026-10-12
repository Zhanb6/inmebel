<?php

namespace App\Http\Resources\User;

use App\Enums\RoleEnum;
use App\Http\Resources\UserClientData\UserClientDataAdminShowResource;
use App\Http\Resources\UserSellerData\UserSellerDataAdminShowResource;
use App\Http\Resources\UserWorkShopData\UserWorkShopDataAdminShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id'=>$this->id,
            'name'=>$this->name,
            'phone'=>$this->phone,
            'created_at'=>$this->created_at,
        ];

        if($this->workshop){
            $data['workshop_data'] = new UserWorkShopDataAdminShowResource($this->workshop);
        }

//        if($this->seller_data){
//            $data['seller_data'] = new UserSellerDataAdminShowResource($this->seller_data);
//        }

        if($this->client_data){
            $data['client_data'] = new UserClientDataAdminShowResource($this->client_data);
        }


        return $data;
    }
}
