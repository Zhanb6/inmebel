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
use App\Services\FurnitureService\FurnitureSubtype\Kitchen\FurnitureSubtypeFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class Kitchen extends FurnitureBase
{
    public static $type = FurnitureTypeEnum::KITCHEN->value;

    public function store()
    {
        $data = $this->data;

        $model = $this->getModel();

        DB::transaction(function () use ($model) {
            $model->save();

            if ($model->addons) {
                foreach ($model->addons as $addon) {
                    $addon->addon_data->save();
                    $addonModel = $addon->addon_data;

                    $model->addons()->create([
                        'addon_data_id' => $addonModel->id,
                        'addon_data_type' => $addonModel->getMorphClass(),
                    ]);
                }
            }

            if ($model->filling) {
                $syncFilling = $model->filling->keyBy('filling_id');

                $model->filling()->sync($syncFilling->toArray());
            }

            if (@$model->subtype_data){
                $model->subtype_data->save();

                $model->subtype_data()->associate($model->subtype_data);
                $model->save();
            }
        });


        return $model->fresh();
    }

    public function getModel()
    {
        $data = $this->data;
        $validatedData = $this->validator()->validate();

        $kitchen = new \App\Models\Kitchen($validatedData);
        $kitchen->setRelation('furniture_type', FurnitureType::find(static::$type));

        if (@$validatedData['addons'] && count($validatedData['addons'])) {
            $addonBuffer = collect([]);

            foreach ($validatedData['addons'] as $key => $addon) {
                $addonFactory = FurnitureAddonFactory::make($addon['data_type'])->setData($addon)->setMode($this->mode);
                $addon = $addonFactory->getModel();

                $kitchenAddonBuffer = new FurnitureAddonPivot([
                    'addon_data_id' => $addon?->id,
                    'addon_data_type' => $addon->getMorphClass(),
                ]);

                $kitchenAddonBuffer->setRelation('addon_data', $addon);


                $addonBuffer->push($kitchenAddonBuffer);
            }

            $kitchen->setRelation('addons', $addonBuffer);
        }

        if (@$validatedData['filling'] && count($validatedData['filling'])) {
            $fillingBuffer = collect([]);

            foreach ($validatedData['filling'] as $key => $filling) {


                $kitchenFillingBuffer = new FurnitureFilling([
                    'filling_id' => @$filling['id'],
                    'count' => @$filling['count'],
                ]);



                $fillingBuffer->push($kitchenFillingBuffer);
            }

            $kitchen->setRelation('filling', $fillingBuffer);
        }

        if (@$validatedData['subtype_data']){
            $subtype = FurnitureSubtype::find($data['furniture_subtype_id']);

            $subtypeClass = Relation::getMorphedModel($subtype->data_type);

            $subtypeData = new $subtypeClass($validatedData['subtype_data']);

            $kitchen->setRelation('subtype_data', $subtypeData);
        }


        return $kitchen;
    }

    public function rules(): array
    {
        $data = $this->data;
        $required = ($this->mode =='database') ? 'required' : 'nullable';

        $basicRules = [
            'furniture_subtype_id' => [$required,'integer',Rule::exists(FurnitureSubtype::class,'id')->where(function ($query) {
                $query->where('furniture_type_id', static::$type);
            }),],
            'frame_id' => $required.'|integer|exists:App\Models\Frame,id',
            'facade_id' => $required.'|integer|exists:App\Models\Facade,id',
            'facade_type_id' => $required.'|integer|exists:App\Models\FacadeType,id',
            'facade_color_id' => $required.'|integer|exists:App\Models\FacadeColor,id',
            'brand_id' => [$required,'integer','exists:App\Models\Brand,id',function (string $attribute, mixed $value, $fail) {
                if (!FurnitureType::find(static::$type)?->brands()->where('brands.id', $value)->exists()) {
                    $fail("Этот бренд не применим для этой тип мебели.");
                }
            }],
//            'length' => $required.'|numeric',
            'kitchen_tabletop_id'=>$required.'|integer|exists:App\Models\KitchenTabletop,id',
            'filling' => 'nullable|array|min:1',
            'filling.*.id' => $required.'|integer|exists:App\Models\Filling,id',
            'filling.*.count' => $required.'|integer',

            'addons.*.data_type' => $required.'|string|in:' . implode(',', FurnitureAddonFactory::getAllTypes()),
        ];



        if (@$data['addons'] && count($data['addons'])) {
            foreach ($data['addons'] as $key => $addon) {
                if (@$addon['data_type']) {

                    if  ($this->mode =='database'){

                        $rules = FurnitureAddonFactory::make($addon['data_type'])->setData($addon)->rules();
                    } else{
                        $rules = FurnitureAddonFactory::make($addon['data_type'])->setData($addon)->localMode()->rules();
                    }

                    foreach ($rules as $addonKey => $addonRule) {
                        $basicRules['addons.' . $key . '.' . $addonKey] = $addonRule;
                    }
                }
            }
        }

        if (@$data['furniture_subtype_id']) {
                $subtype = FurnitureSubtype::find($data['furniture_subtype_id']);

                if (@$subtype->data_type) {

                    if  ($this->mode =='database'){
                        $rules = FurnitureSubtypeFactory::make($subtype->data_type)->setData($data)->rules();
                    } else{
                        $rules = FurnitureSubtypeFactory::make($subtype->data_type)->setData($data)->localMode()->rules();
                    }

                    foreach ($rules as $subtypeKey => $subtypeRule) {

                        $basicRules['subtype_data.' . $subtypeKey] = $subtypeRule;
                    }

                }

        }

        return $basicRules;
    }

    public function show(Model $kitchen):array
    {
        return [
            'id'=>$kitchen->id,
            'type'=>new FurnitureSubtypeListResource($kitchen->type),
            'frame'=>new IdNameResource($kitchen->frame),
            'facade'=>new IdNameResource($kitchen->facade),
            'facade_type'=>new FacadeTypeList($kitchen->facade_type),
            'facade_color'=>new FacadeColorList($kitchen->facade_color),
            'brand'=>new IdNameResource($kitchen->brand),
            'addons'=>FurnitureAddonShowResource::collection($kitchen->addons),
            'filling'=>FurnitureFillingShowResource::collection($kitchen->filling),
            'kitchen_tabletop_id'=>$kitchen->kitchen_tabletop_id,
            'subtype_data'=>$kitchen->subtype_data,
        ];
    }
}
