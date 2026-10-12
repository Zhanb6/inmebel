<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureFilling extends Model
{
    use SoftDeletes;

    protected $table = 'furniture_filling';


    protected $fillable = [
        'furniture_id',
        'furniture_type',
        'filling_id',
        'count',
    ];
}
