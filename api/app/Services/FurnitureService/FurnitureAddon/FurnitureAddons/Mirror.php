<?php

namespace App\Services\FurnitureService\FurnitureAddon\FurnitureAddons;

use App\Enums\FurnitureAddonDataTypeEnum;
use App\Models\FurnitureAddon;
use App\Models\FurnitureAddonBacklightData;
use App\Models\FurnitureAddonMirrorData;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonBase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Mirror extends FurnitureAddonBase
{
    public static $type = FurnitureAddonDataTypeEnum::MIRROR->value;

    public function store()
    {
        $data = $this->data;


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
            'height'=>$required.'|numeric',
        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();


        return new FurnitureAddonMirrorData([
            'furniture_addon_id'=>@$data['id'],
            'length'=>@$data['length'],
            'count'=>@$data['count'],
            'height'=>@$data['height'],
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
            'height'=>$model->height,
            'count'=>$model->count,
        ];
    }
}

