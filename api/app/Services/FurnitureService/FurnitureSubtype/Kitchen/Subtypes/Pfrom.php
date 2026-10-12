<?php

namespace App\Services\FurnitureService\FurnitureSubtype\Kitchen\Subtypes;

use App\Enums\FurnitureSubtypeDataTypeEnum;
use App\Models\FurnitureSubtype;
use App\Models\FurnitureSubtypeCornerData;
use App\Models\FurnitureSubtypeLowerModuleData;
use App\Models\FurnitureSubtypePformData;
use App\Models\Kitchen;
use App\Services\FurnitureService\FurnitureSubtype\Kitchen\FurnitureSubtypeBase;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class Pfrom extends FurnitureSubtypeBase
{
    public static $type = FurnitureSubtypeDataTypeEnum::P_FORM->value;

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
            'length_first'=>$required.'|numeric',
            'length_second'=>$required.'|numeric',
            'length_third'=>$required.'|numeric',
        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();

        return new FurnitureSubtypePformData([
            'length_first'=>@$data['length_first'],
            'length_second'=>@$data['length_second'],
            'length_third'=>@$data['length_third'],
        ]);
    }

    public function show(Model $model):array
    {
        return [
            'id'=>$model->id,
            'length_first'=>$model->length_first,
            'length_second'=>$model->length_second,
            'length_third'=>$model->length_third,
        ];
    }

    public function calculate(Kitchen $model):float
    {
        $this->setData($model->subtype_data);
        $minusLength = 0.6;

        $sumLength = $this->data['length_second'] + $this->data['length_first'] + $this->data['length_third'];

        $length = $sumLength  > 0 ? $sumLength - $minusLength : 0;

        $total = 0;
        $price = $model->furniture_type?->prices()->where('facade_id',$model->facade_id)->where('frame_id',$model->frame_id)->first()?->price
            ?? throw ValidationException::withMessages([
                'facade_id' => ['Выберите другой материал фасада.'],
            ]);


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

