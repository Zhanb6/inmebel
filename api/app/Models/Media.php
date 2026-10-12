<?php

namespace App\Models;

use App\Policies\MediaPolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;


class Media extends SpatieMedia
{

    protected $with = ['signatures'];

    protected $appends = [
        'signatures_url'
    ];

    public function getSignaturesUrlAttribute()
    {
        return $this->signatures?->count() ? route('general.media.signature.download', ['uuid' => $this->uuid]) : null;
    }

    public function signatures()
    {
        return $this->hasMany(SignedMedia::class, 'media_id');
    }
}
