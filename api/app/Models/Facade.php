<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facade extends Model
{
    use SoftDeletes;


    protected $fillable = [
        'name',
    ];

    public function types()
    {
        return $this->belongsToMany(FacadeType::class,FacadeFacadeType::class);
    }

    public function colors()
    {
        return $this->belongsToMany(FacadeColor::class,FacadeFacadeColor::class);
    }

    public function furniture_types()
    {
        return $this->belongsToMany(FurnitureType::class,FurnitureTypeFacade::class)->using(FurnitureTypeFacade::class)->withPivot('price');
    }

}
