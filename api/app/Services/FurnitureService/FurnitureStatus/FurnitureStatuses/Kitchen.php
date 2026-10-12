<?php

namespace App\Services\FurnitureService\FurnitureStatus\FurnitureStatuses;

use App\Enums\FurnitureTypeEnum;
use App\Enums\RequestStatusEnum;
use App\Models\FurnitureAddonPivot;
use App\Models\FurnitureFilling;
use App\Models\FurnitureSubtype;

use App\Models\RequestModel;
use App\Models\RequestStatus;
use App\Services\FurnitureService\Furniture\FurnitureBase;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonFactory;

use App\Services\FurnitureService\FurnitureStatus\FurnitureStatusBase;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Kitchen extends FurnitureStatusBase
{
    public static $type = FurnitureTypeEnum::KITCHEN->value;

    public function getInnerStatues(): array
    {
        return  [
            RequestStatusEnum::FRAME_MAKING,
            RequestStatusEnum::FACADE_MAKING,
        ];
    }


}
