<?php

namespace App\Services\FurnitureService\FurnitureSubtype\Wardrobe;

use InvalidArgumentException;

class WardrobeSubtypeFactory
{
    public static function make(string $type): WardrobeSubtypeBase
    {
        $namespace = __NAMESPACE__ . '\Subtypes';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/Subtypes/*.php') as $file) {
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
        $namespace = __NAMESPACE__ . '\Subtypes';
        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/Subtypes/*.php') as $file) {
            $class = $namespace . '\\' . pathinfo($file, PATHINFO_FILENAME);
            if (class_exists($class) && property_exists($class, 'type')) {
                $data[]= $class::$type;
            }
        }
        return  $data;
    }

}
