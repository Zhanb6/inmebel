<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureType extends Model
{
    use SoftDeletes;


    protected $fillable = [
        'name',
        'percent_minus',
        'percent_plus',
    ];

    public function subtypes()
    {
        return $this->hasMany(FurnitureSubtype::class);
    }

    public function facades()
    {
        return $this->belongsToMany(Facade::class,'furniture_type_facade')->using(FurnitureTypeFacade::class)->withPivot('price');
    }

    public function brands()
    {
        return $this->belongsToMany(Brand::class,'furniture_type_brand')->withPivot('percentage');
    }

    public function addons()
    {
        return $this->belongsToMany(FurnitureAddon::class,'furniture_type_furniture_addon');
    }

    public function prices()
    {
        return $this->hasMany(FurnitureTypePrice::class);
    }
}
