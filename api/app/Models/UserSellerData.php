<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UserSellerData extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'name',
        'iin',
        'address',
        'accepted_at'
    ];

    protected $casts =[
        'accepted_at' => 'datetime',
    ];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Contain, 1600, 700)
            ->nonQueued();

        $this
            ->addMediaConversion('1200x600')
            ->fit(Fit::Contain, 1200, 600)
            ->nonQueued();
        $this
            ->addMediaConversion('500x500')
            ->fit(Fit::Contain, 500, 500)
            ->nonQueued();
        $this
            ->addMediaConversion('250x250')
            ->fit(Fit::Contain, 250, 250)
            ->nonQueued();
    }
}
