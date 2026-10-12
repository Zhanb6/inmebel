<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConsoleTabletop extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'price',
    ];

    public function sinks()
    {
        return $this->belongsToMany(ConsoleSink::class,'console_tabletop_sink')->withPivot('price');
    }
}
