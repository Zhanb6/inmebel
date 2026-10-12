<?php

namespace App\Enums;

enum FurnitureSubtypeDataTypeEnum:string
{
    case CORNER = 'furniture_subtype_corner_data';
    case LOWER_MODULE = 'furniture_subtype_lower_module_data';
    case P_FORM = 'furniture_subtype_pform_data';
    case CLOSET_SWING = 'furniture_subtype_closet_swing_data';
    case CLOSET_SLIDING = 'furniture_subtype_closet_sliding_data';
    case WARDROBE_P_FORM = 'furniture_subtype_wardrobe_pform_data';
    case WARDROBE_LINEAR_FORM = 'furniture_subtype_wardrobe_linear_form_data';
    case WARDROBE_G_FORM = 'furniture_subtype_wardrobe_g_form_data';
    case KITCHEN_LINEAR = 'furniture_subtype_kitchen_linear_data';

    public function getName(): string
    {
        return match ($this) {
            self::CORNER => __('Угловая'),
            default => __('Unknown')
        };
    }

    public static function list()
    {
        $result = [];

        foreach (static::cases() as $case) {

            $result[] = [
                'key' => $case->value,
                'name' => $case->getName(),
            ];
        }

        return $result;
    }
}
