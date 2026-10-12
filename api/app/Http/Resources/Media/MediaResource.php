<?php

namespace App\Http\Resources\Media;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
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
            'uuid'=>$this->uuid,
            'file_name'=>$this->file_name,
            'mime_type'=>$this->mime_type,
            'size'=>$this->size,
            'original_url'=>$this->original_url,
            'signatures_url'=>$this->signatures_url,
//            'preview_url'=>$this->preview_url,
        ];
    }
}
