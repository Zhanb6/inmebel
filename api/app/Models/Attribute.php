<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attribute extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
    ];

    public function variants()
    {
        return $this->hasMany(AttributeVariant::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class,'category_attribute');
    }
}
