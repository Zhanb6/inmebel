<?php

namespace App\Services\FurnitureService\FurnitureAddon\FurnitureAddons;

use App\Enums\FurnitureAddonDataTypeEnum;
use App\Enums\FurnitureTypeEnum;
use App\Models\FurnitureAddon;
use App\Models\FurnitureAddonBacklight;
use App\Models\FurnitureAddonBacklightData;
use App\Models\FurnitureSubtype;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonBase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Backlight extends FurnitureAddonBase
{
    public static $type = FurnitureAddonDataTypeEnum::BACKLIGHT->value;

    public function store()
    {
        $data = $this->data;
        $this->validator()->validate();

        $model = $this->getModel();
        $model->save();

        return $model->fresh();
    }

    public function rules():array
    {
        $required = ($this->mode =='database') ? 'required' : 'nullable';

        return [
            'id'=>[$required,'integer',Rule::exists(FurnitureAddon::class,'id')->where(function ($query) {
                    $query->where('data_type', static::$type);
                }),],
            'count'=>$required.'|integer',
            'length'=>$required.'|numeric',
        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();


        return new FurnitureAddonBacklightData([
            'furniture_addon_id'=>@$data['id'],
            'length'=>@$data['length'],
            'count'=>@$data['count'],
        ]);
    }

    public function show(Model $model):array
    {
        return [
            'id'=>$model->furniture_addon_id,
            'data_type'=>$model->furniture_addon?->data_type,
            'furniture_addon'=>$model->furniture_addon?->name,
            'furniture_addon_id'=>$model->furniture_addon_id,
            'length'=>$model->length,
            'count'=>$model->count,
        ];
    }
}
