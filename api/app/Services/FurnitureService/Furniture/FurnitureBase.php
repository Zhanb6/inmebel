<?php

namespace App\Services\FurnitureService\Furniture;


use App\Models\FurnitureType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

abstract class FurnitureBase
{
    public static $type;

    public $mode = 'database';

    public $data = [];

    //сохранение в базу
    abstract public function store();
    //получение временный модели для калькулятора, создание и тд
    abstract public function getModel();
    //для валидации
    abstract public function rules():array;
    abstract public function show(Model $model):array;

    public function validator(): \Illuminate\Contracts\Validation\Validator
    {
        return Validator::make($this->data, $this->rules());
    }

    //калькулятор цены
    public function calculatePrice()
    {
        return $this->localMode()->getModel()->calculatePrice();
    }

    public function calculatePriceFrom()
    {
        $furnitureType = FurnitureType::find(static::$type);

        return $this->localMode()->getModel()->calculatePrice() * ((100 - $furnitureType->percent_minus)/100);
    }

    public function calculatePriceTo()
    {
        $furnitureType = FurnitureType::find(static::$type);

        return $this->localMode()->getModel()->calculatePrice() * ((100 + $furnitureType->percent_plus)/100);
    }

    //local mode в валидации делает поля необязательными
    public function localMode()
    {
        $this->mode = 'local';

        return $this;
    }

    public function setData($data = [])
    {
        $this->data = $data;

        return $this;
    }

}
