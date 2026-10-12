<?php

namespace App\Services\FurnitureService\FurnitureStatus\FurnitureStatuses;

use App\Enums\FurnitureTypeEnum;
use App\Enums\RequestStatusEnum;
use App\Models\FurnitureAddonPivot;
use App\Models\FurnitureFilling;
use App\Models\FurnitureSubtype;
use App\Services\FurnitureService\Furniture\FurnitureBase;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonFactory;

use App\Services\FurnitureService\FurnitureStatus\FurnitureStatusBase;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ConsoleTable extends FurnitureStatusBase
{
    public static $type = FurnitureTypeEnum::CONSOLE_TABLE->value;

    public function getInnerStatues(): array
    {
        return  [
            RequestStatusEnum::FRAME_MAKING,
            RequestStatusEnum::FACADE_MAKING,
        ];
    }
}
