<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\General\IdNameResource;
use App\Http\Resources\Media\MediaResource;
use App\Http\Resources\Review\ReviewShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductShowResource extends JsonResource
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
            'price'=>$this->price,
            'description'=>$this->description,
            'media'=>MediaResource::collection($this->getMedia()),
            'created_at'=>$this->created_at,
            'reviews'=>ReviewShowResource::collection($this->reviews),
            'categories'=>IdNameResource::collection($this->categories),
            'attributes'=>ProductAttributeShowResource::collection($this->attributes),
            'user_liked'=>(bool)$this->auth_user_like,
            'reviews_avg_star'=>$this->reviews_avg_star,
            'reviews_with_comment_count'=>$this->reviews_with_comment_count,
            'reviews_count'=>$this->reviews_count,
        ];
    }
}
