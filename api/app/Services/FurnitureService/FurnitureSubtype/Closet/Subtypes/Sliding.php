<?php

namespace App\Services\FurnitureService\FurnitureSubtype\Closet\Subtypes;

use App\Enums\FurnitureSubtypeDataTypeEnum;
use App\Models\Closet;
use App\Models\FurnitureSubtypeClosetSlidingData;
use App\Models\FurnitureSubtypeClosetSwingData;
use App\Models\FurnitureSubtypeCornerData;
use App\Models\Kitchen;
use App\Services\FurnitureService\FurnitureSubtype\Closet\ClosetSubtypeBase;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class Sliding extends ClosetSubtypeBase
{
    public static $type = FurnitureSubtypeDataTypeEnum::CLOSET_SLIDING->value;

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
            'count_door'=>$required.'|integer|min:1',
        ];
    }

    public function getModel()
    {
        $data = $this->data;

        $this->validator()->validate();

        return new FurnitureSubtypeClosetSlidingData([
            'count_door'=>@$data['count_door']
        ]);
    }

    public function show(Model $model):array
    {
        return [
            'id'=>$model->id,
            'count_door'=>$model->count_door,
        ];
    }

    public function calculate(Closet $model):float
    {
        $doorPrice = 50000;

        $this->setData($model->subtype_data);
        $total = 0;

        $price = $model->furniture_type?->prices()->where('facade_id',$model->facade_id)->where('frame_id',$model->frame_id)->first()?->price
            ?? throw ValidationException::withMessages([
                'facade_id' => ['Выберите другой материал фасада.'],
            ]);

        $total += $model->length * $model->height * ($price ?? 0);

        if ($this->data['count_door']){
            $total += $this->data['count_door'] * $doorPrice;
        }


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
