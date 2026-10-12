<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller;
use App\Http\Resources\FurnitureType\FurnitureTypeGeneralListResource;
use App\Models\FurnitureType;

class FurnitureTypeController extends Controller
{
    public function list()
    {
        $furnitureTypes = FurnitureType::all();

        return FurnitureTypeGeneralListResource::collection($furnitureTypes);
    }
}
