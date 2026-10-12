<?php

namespace App\Traits;

use App\Models\Filling;
use App\Models\FurnitureFilling;

trait HasFillingTrait
{
    public function filling()
    {
        return $this->morphToMany(Filling::class,'furniture',FurnitureFilling::class)->withPivot('count');
    }
}
