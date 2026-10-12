<?php

namespace App\Services\FurnitureService\FurnitureSubtype\Wardrobe\Subtypes;

use App\Enums\FurnitureSubtypeDataTypeEnum;
use App\Models\FurnitureSubtype;
use App\Models\FurnitureSubtypeCornerData;
use App\Models\FurnitureSubtypeLowerModuleData;
use App\Models\FurnitureSubtypePformData;
use App\Models\FurnitureSubtypeWardrobeLinearFormData;
use App\Models\Kitchen;
use App\Models\Wardrobe;
use App\Services\FurnitureService\FurnitureSubtype\Kitchen\FurnitureSubtypeBase;
use App\Services\FurnitureService\FurnitureSubtype\Wardrobe\WardrobeSubtypeBase;
use App\Services\FurnitureService\FurnitureSubtype\Wardrobe\WardrobeSubtypeFactory;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class LinearForm extends WardrobeSubtypeBase
{
    public static $type = FurnitureSubtypeDataTypeEnum::WARDROBE_LINEAR_FORM->value;

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
            'height'=>$required.'|numeric',
        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();

        return new FurnitureSubtypeWardrobeLinearFormData([
            'height'=>@$data['length_first'],
            'length'=>@$data['length_second'],
        ]);
    }

    public function show(Model $model):array
    {
        return [
            'id'=>$model->id,
            'height'=>$model->height,
            'length'=>$model->length,

        ];
    }

    public function calculate(Wardrobe $model):float
    {
        $this->setData($model->subtype_data);

        $total = 0;

        $total += $this->data['length'] * $this->data['height'] * ($model->frame?->price ?? 0);

        if ($model->brand){
            $percentage = $model->furniture_type->brands()->where('brands.id',$model->brand?->id)?->firstOrFail()?->pivot?->percentage ?? 0;

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

