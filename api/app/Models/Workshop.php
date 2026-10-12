<?php

namespace App\Models;

use App\Traits\HasReviewTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Workshop extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia, HasReviewTrait;

    protected $fillable = [
        'name',
        'iin',
        'address',
        'accepted_at',
        'description',

        'bic',
        'bank',
        'director_name',
        'iic',
        'bc',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

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

    public function price_lists()
    {
        return $this->hasMany(WorkshopPriceList::class);
    }

    public function scopeFilter($query,$data = [])
    {
        $query->when(@$data['search'],function ($query,$data) {
            $query->where('workshops.name','like','%'.$data.'%');
            $query->orWhere('workshops.iin','like','%'.$data.'%');
            $query->orWhere('workshops.director_name','like','%'.$data.'%');
        });

    }

    public function orders()
    {
        return $this->hasMany(Order::class,'workshop_id');
    }

    public function requests()
    {
        return $this->hasMany(RequestModel::class,'workshop_id');
    }


}
