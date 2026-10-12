<?php

namespace App\Services\FurnitureService\FurnitureSubtype\Kitchen\Subtypes;

use App\Enums\FurnitureSubtypeDataTypeEnum;
use App\Models\FurnitureSubtype;
use App\Models\FurnitureSubtypeCornerData;
use App\Models\FurnitureSubtypeLowerModuleData;
use App\Models\Kitchen;
use App\Services\FurnitureService\FurnitureSubtype\Kitchen\FurnitureSubtypeBase;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LowerModule extends FurnitureSubtypeBase
{
    public static $type = FurnitureSubtypeDataTypeEnum::LOWER_MODULE->value;

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
            'length'=>$required.'|numeric',

        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();

        return new FurnitureSubtypeLowerModuleData([
            'length'=>@$data['length'],

        ]);
    }

    public function show(Model $model):array
    {
        return [
            'id'=>$model->id,
            'length'=>$model->length,
        ];
    }

    public function calculate(Kitchen $model):float
    {
        $this->setData($model->subtype_data);
        $minusPercent = 30;
        $sumLength = $this->data['length'];
        $length = $sumLength;

        $total = 0;
        $price = $model->furniture_type?->prices()->where('facade_id',$model->facade_id)->where('frame_id',$model->frame_id)->first()?->price
            ?? throw ValidationException::withMessages([
                'facade_id' => ['Выберите другой материал фасада.'],
            ]);

        $price = $price * ($minusPercent*100);

        $total += $length * ($price ?? 0);


        if ($model->brand){
            $percentage = $model->furniture_type->brands()->where('brands.id',$model->brand?->id)?->firstOrFail()?->pivot?->percentage ?? 0;

            $total = $total * ((100 + ($percentage ?? 0))/100);
        }

        if ($model->kitchen_tabletop){
            $total += ($model->kitchen_tabletop?->price ?? 0) * $length;
        }

        if ($model->addons?->count()){
            foreach ($model->addons as $addon){
                $total += $addon->calculatePrice();
            }
        }

        return $total;
    }
}
