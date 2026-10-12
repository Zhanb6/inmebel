<?php

namespace App\Services\FurnitureService\Furniture\Furniture;

use App\Enums\FurnitureTypeEnum;
use App\Http\Resources\FacadeColor\FacadeColorList;
use App\Http\Resources\FacadeType\FacadeTypeList;
use App\Http\Resources\FurnitureAddon\FurnitureAddonShowResource;
use App\Http\Resources\FurnitureFilling\FurnitureFillingShowResource;
use App\Http\Resources\FurnitureSubtype\FurnitureSubtypeListResource;
use App\Http\Resources\General\IdNameResource;
use App\Models\FurnitureAddonPivot;
use App\Models\FurnitureFilling;
use App\Models\FurnitureSubtype;
use App\Models\FurnitureType;
use App\Services\FurnitureService\Furniture\FurnitureBase;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonFactory;

use App\Services\FurnitureService\FurnitureSubtype\Closet\ClosetSubtypeBase;
use App\Services\FurnitureService\FurnitureSubtype\Closet\ClosetSubtypeFactory;
use App\Services\FurnitureService\FurnitureSubtype\Kitchen\FurnitureSubtypeFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Mirror extends FurnitureBase
{
    public static $type = FurnitureTypeEnum::MIRROR->value;

    public function store()
    {
        $data = $this->data;
        $model = $this->getModel($data);

        DB::transaction(function () use ($model) {
            $model->save();
        });

        return $model->fresh();
    }

    public function getModel()
    {

        $data = $this->data;
        $validatedData = $this->validator()->validate();

        $furniture = new \App\Models\Mirror($validatedData);

        return $furniture;
    }

    public function rules(): array
    {
        $data = $this->data;
        $required = ($this->mode =='database') ? 'required' : 'nullable';

        $basicRules = [
            'mirror_form_id'=>$required.'|integer|exists:App\Models\MirrorForm,id',
            'mirror_backlight_id'=>$required.'|integer|exists:App\Models\MirrorBacklight,id',
            'mirror_frame_id'=>$required.'|integer|exists:App\Models\MirrorFrame,id',
            'length' => $required.'|numeric',
            'height' => $required.'|numeric',
        ];

        return $basicRules;
    }

    public function show(Model $data):array
    {
        return [
            'id'=>$data->id,
            'form'=>new IdNameResource($data->form),
            'backlight'=>new IdNameResource($data->backlight),
            'frame'=>new IdNameResource($data->frame),

        ];
    }
}
