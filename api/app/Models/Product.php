<?php

namespace App\Models;

use App\Traits\HasLikeTrait;
use App\Traits\HasReviewTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use SoftDeletes,InteractsWithMedia, HasReviewTrait, HasLikeTrait;

    protected $fillable = [
        'workshop_id',
        'name',
        'price',
        'description',
    ];

    public function workshop()
    {
        return $this->belongsTo(Workshop::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class,'product_category');
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Contain, 500, 700)
            ->nonQueued();

    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('default')->useDisk('public');
    }


    public function scopeFilter($query,$data)
    {
        $query->when(@$data['search'],function ($query) use ($data){
            $query->where('name','ilike',"%{$data['search']}%");
            $query->orWhere('id','ilike','%'.$data['search'].'%');

            $query->orWhereHas('workshop',function ($query) use ($data){
                $query->filter($data);
            });
        });
    }


}
