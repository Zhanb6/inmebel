<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

trait IsActive{

    public function scopeActive($query)
    {
        return $query->where('isActive', 1);
    }
}
