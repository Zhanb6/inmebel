<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MirrorPrice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'mirror_form_id',
        'mirror_backlight_id',
        'price',
        'price_add',
    ];
}
