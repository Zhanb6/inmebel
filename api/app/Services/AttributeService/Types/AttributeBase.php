<?php

namespace App\Services\AttributeService\Types;

use App\Enums\AttributeTypeEnum;
use App\Models\Product;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonFactory;
use Illuminate\Support\Facades\Validator;

abstract class AttributeBase
{
    public static $type;
    abstract public function rules():array;
    abstract public function saveToProduct(Product $product);
    protected $data = [];
    public function validator(): \Illuminate\Contracts\Validation\Validator
    {
        return Validator::make($this->data, $this->rules());
    }



    public function setData($data = [])
    {
        $this->data = $data;

        return $this;
    }

}
