<?php

namespace App\Models;

use App\Services\FurnitureService\FurnitureSubtype\Wardrobe\WardrobeSubtypeFactory;
use App\Traits\HasAddonsTrait;
use App\Traits\HasFillingTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wardrobe extends Model
{
    use SoftDeletes, HasAddonsTrait, HasFillingTrait;

    protected $fillable = [
        'furniture_subtype_id',
        'frame_id',

        'brand_id',
//        'length',
//        'height',
        'furniture_subtype_data_id',
        'furniture_subtype_data_type',
    ];

    public function type()
    {
        return $this->belongsTo(FurnitureSubtype::class,'furniture_subtype_id');
    }

    public function furniture_type()
    {
        return $this->hasOneThrough(FurnitureType::class, FurnitureSubtype::class,'id','id', 'furniture_subtype_id','furniture_type_id');
    }

    public function frame()
    {
        return $this->belongsTo(Frame::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function subtype_data()
    {
        return $this->morphTo('furniture_subtype_data');
    }

    public function calculatePrice()
    {

        $subtype = $this->type->data_type;

        return WardrobeSubtypeFactory::make($subtype)->calculate($this);
    }
}
