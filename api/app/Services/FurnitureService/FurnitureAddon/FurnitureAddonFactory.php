<?php

namespace App\Services\FurnitureService\FurnitureAddon;

use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

class FurnitureAddonFactory
{
    public static function make(string $type): FurnitureAddonBase
    {
        $namespace = __NAMESPACE__ . '\FurnitureAddons';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/FurnitureAddons/*.php') as $file) {
            $class = $namespace . '\\' . pathinfo($file, PATHINFO_FILENAME);
            if (class_exists($class) && property_exists($class, 'type')) {

                if ($type === $class::$type) {
                    return new $class();
                }
            }
        }

        throw new InvalidArgumentException("Unsupported notification type [$type]");
    }

    public static function getAllTypes(): array
    {
        $data = [];
        $namespace = __NAMESPACE__ . '\FurnitureAddons';
        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/FurnitureAddons/*.php') as $file) {
            $class = $namespace . '\\' . pathinfo($file, PATHINFO_FILENAME);
            if (class_exists($class) && property_exists($class, 'type')) {
                $data[]= $class::$type;
            }
        }
        return  $data;
    }

}
