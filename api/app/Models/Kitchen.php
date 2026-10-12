<?php

namespace App\Models;

use App\Services\FurnitureService\FurnitureSubtype\Kitchen\FurnitureSubtypeFactory;
use App\Traits\FurnitureHasRequestTrait;
use App\Traits\HasAddonsTrait;
use App\Traits\HasFillingTrait;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kitchen extends Model
{
    use SoftDeletes, HasAddonsTrait, HasFillingTrait, FurnitureHasRequestTrait;

    protected $fillable = [
        'furniture_subtype_id',
        'frame_id',
        'facade_id',
        'facade_type_id',
        'facade_color_id',
        'brand_id',
        'kitchen_tabletop_id',
        'length',
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
    public function facade()
    {
        return $this->belongsTo(Facade::class);
    }

    public function facade_type()
    {
        return $this->belongsTo(FacadeType::class);
    }

    public function facade_color()
    {
        return $this->belongsTo(FacadeColor::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function kitchen_tabletop()
    {
        return $this->belongsTo(KitchenTabletop::class);
    }

    public function subtype_data()
    {
        return $this->morphTo('furniture_subtype_data');
    }

    public function calculatePrice()
    {
        $subtype = $this->type->data_type;

        return FurnitureSubtypeFactory::make($subtype)->calculate($this);
    }
}
