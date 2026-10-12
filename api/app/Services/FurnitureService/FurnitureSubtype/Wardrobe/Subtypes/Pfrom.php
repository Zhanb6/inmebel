<?php

namespace App\Services\FurnitureService\FurnitureSubtype\Wardrobe\Subtypes;

use App\Enums\FurnitureSubtypeDataTypeEnum;
use App\Models\FurnitureSubtype;
use App\Models\FurnitureSubtypeCornerData;
use App\Models\FurnitureSubtypeLowerModuleData;
use App\Models\FurnitureSubtypePformData;
use App\Models\FurnitureSubtypeWardrobePformData;
use App\Models\Kitchen;
use App\Models\Wardrobe;
use App\Services\FurnitureService\FurnitureSubtype\Kitchen\FurnitureSubtypeBase;
use App\Services\FurnitureService\FurnitureSubtype\Wardrobe\WardrobeSubtypeBase;
use App\Services\FurnitureService\FurnitureSubtype\Wardrobe\WardrobeSubtypeFactory;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class Pfrom extends WardrobeSubtypeBase
{
    public static $type = FurnitureSubtypeDataTypeEnum::WARDROBE_P_FORM->value;

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

            'height'=>$required.'|numeric',
            'length_first'=>$required.'|numeric',
            'length_second'=>$required.'|numeric',
            'length_third'=>$required.'|numeric',
        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();

        return new FurnitureSubtypeWardrobePformData([
            'height'=>@$data['height'],
            'length_first'=>@$data['length_first'],
            'length_second'=>@$data['length_second'],
            'length_third'=>@$data['length_third'],
        ]);
    }

    public function show(Model $model):array
    {
        return [
            'id'=>$model->id,
            'height'=>$model->height,
            'length_first'=>$model->length_first,
            'length_second'=>$model->length_second,
            'length_third'=>$model->length_third,
        ];
    }

    public function calculate(Wardrobe $model):float
    {
        $minusLength = 1.2;
        $this->setData($model->subtype_data);

        $total = 0;

        $total += ($this->data['length_first'] + $this->data['length_second'] + $this->data['length_third'] - $minusLength) * $this->data['height'] * ($model->frame?->price ?? 0);

        if ($model->brand){
            $percentage = $model->furniture_type->brands()->where('brands.id',$model->brand?->id)?->firstOrFail()?->pivot?->percentage ?? throw new Exception('Бренд не найден');

            $total = $total * ((100 + ($percentage ?? 0))/100);
        }

        if ($model->addons?->count()){
            foreach ($model->addons as $addon){
                $total += $addon->calculatePrice();
            }
        }

        return $total;
    }
}

