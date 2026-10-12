<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureAddon extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'data_type',
        'price',
    ];
}
