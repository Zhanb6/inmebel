<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureSubtypeCornerData extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'length_first',
        'length_second',
    ];
}
