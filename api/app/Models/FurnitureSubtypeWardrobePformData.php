<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureSubtypeWardrobePformData extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'height',
        'length_first',
        'length_second',
        'length_third',
    ];
}
