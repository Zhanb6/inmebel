<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureTypePrice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'furniture_type_id',
        'facade_id',
        'frame_id',
        'price',
    ];
}
