<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'star',
        'comment',
        'person_type',
        'person_id',
    ];

    public function person()
    {
        return $this->morphTo('person');
    }
}
