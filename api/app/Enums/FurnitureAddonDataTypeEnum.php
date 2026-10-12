<?php

namespace App\Enums;

enum FurnitureAddonDataTypeEnum:string
{
    case BACKLIGHT = 'furniture_addon_backlight_data';
    case MIRROR = 'furniture_addon_mirror_data';
    case MIRROR_SHAPE = 'furniture_addon_mirror_shape_data';
    case PLUS_RULE = 'furniture_addon_plus_rule_data';


    public function getName(): string
    {
        return match ($this) {
            self::BACKLIGHT => __('Подсветки'),
            self::MIRROR => __('Зеркало'),
            self::MIRROR_SHAPE => __('Форма зеркало'),
            self::PLUS_RULE => __('Разное'),

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
