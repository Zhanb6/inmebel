<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserClientData extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'iin',
        'address',
    ];
}
