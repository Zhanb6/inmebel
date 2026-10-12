<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class RequestStatusHistory extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'request_id',
        'request_status_id',
        'comment',
    ];

    public function request_model()
    {
        return $this->belongsTo(RequestModel::class,'request_id');
    }
}
