<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureSubtypeLowerModuleData extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'length',

    ];
}
