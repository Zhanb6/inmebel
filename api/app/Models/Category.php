<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'parent_category_id',
        'name',
    ];

    public function attributes()
    {
        return $this->belongsToMany(Attribute::class,'category_attribute');
    }
}
