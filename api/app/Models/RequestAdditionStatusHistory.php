<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class RequestAdditionStatusHistory extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'request_addition_id',
        'request_addition_status_id',
        'comment',
    ];

    public function request_addition()
    {
        return $this->belongsTo(RequestAddition::class,'request_addition_id');
    }
}
