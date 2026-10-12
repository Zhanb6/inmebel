<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class FurnitureTypeFacade extends Pivot
{
    protected $fillable  = [
        'price'
    ];
}
