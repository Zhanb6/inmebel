<?php

namespace App\Traits;

use App\Models\FurnitureAddonPivot;
use App\Models\RequestModel;

trait FurnitureHasRequestTrait
{
    public function request_model()
    {
        return $this->morphOne(RequestModel::class, 'furniture_data');
    }
}
