<?php

namespace App\Services\FurnitureService\FurnitureAddon\FurnitureAddons;

use App\Enums\FurnitureAddonDataTypeEnum;
use App\Models\FurnitureAddon;
use App\Models\FurnitureAddonMirrorShapeData;
use App\Models\FurnitureAddonPlusRuleData;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonBase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class PlusRule extends FurnitureAddonBase
{
    public static $type = FurnitureAddonDataTypeEnum::PLUS_RULE->value;

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
        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();

        return new FurnitureAddonPlusRuleData([
            'furniture_addon_id'=>@$data['id'],
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
            'count'=>$model->count,
        ];
    }
}
