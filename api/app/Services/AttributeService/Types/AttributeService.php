<?php

namespace App\Services\AttributeService\Types;

use App\Enums\AttributeTypeEnum;
use App\Models\Attribute;

class AttributeService
{
    public static function getFullRules($data)
    {
        $basicRules = [];
        if (@$data['attributes'] && count($data['attributes'])) {
            foreach ($data['attributes'] as $key => $attributes) {

                if (@$attributes['id']) {
                    $type = Attribute::find($attributes['id'])?->type;

                    if ($type){
                        $rules = AttributeFactory::make(AttributeTypeEnum::tryFrom($type))->setData($attributes)->rules();


                        foreach ($rules as $addonKey => $addonRule) {
                            $basicRules['attributes.' . $key . '.' . $addonKey] = $addonRule;
                        }
                    }


                }
            }
        }

        return $basicRules;
    }
}
