<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureSubtypeClosetSlidingData extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'count_door'
    ];
}
