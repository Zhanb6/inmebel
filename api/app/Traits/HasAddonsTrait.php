<?php

namespace App\Traits;

use App\Models\FurnitureAddonPivot;

trait HasAddonsTrait
{
    public function addons()
    {
        return $this->morphMany(FurnitureAddonPivot::class,'furniture');
    }
}
