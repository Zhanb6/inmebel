<?php

namespace App\Services\FurnitureService\FurnitureAddon;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

abstract class FurnitureAddonBase
{
    public static $type;
    public $data = [];
    public $mode = 'database';


    abstract public function store();
    abstract public function getModel();
    abstract public function rules():array;
    abstract public function show(Model $model):array;

    public function validator(): \Illuminate\Contracts\Validation\Validator
    {
        return Validator::make($this->data, $this->rules());
    }

    public function localMode()
    {
        $this->mode = 'local';

        return $this;
    }

    public function setMode($mode)
    {
        $this->mode = $mode;

        return $this;
    }

    public function setData($data = [])
    {
        $this->data = $data;

        return $this;
    }
}
