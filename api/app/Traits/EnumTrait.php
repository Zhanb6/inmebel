<?php

namespace App\Traits;

use Illuminate\Support\Arr;

trait EnumTrait
{
    public static function toValidation():string
    {
        return implode(',',Arr::pluck(self::cases(),'value'));
    }

}
