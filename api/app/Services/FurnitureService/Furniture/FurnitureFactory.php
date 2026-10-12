<?php

namespace App\Services\FurnitureService\Furniture;


use InvalidArgumentException;

class FurnitureFactory
{
    //реализация фабричного паттерна проектирование
    public static function make(string $type): FurnitureBase
    {
        $namespace = __NAMESPACE__ . '\Furniture';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/Furniture/*.php') as $file) {
            $class = $namespace . '\\' . pathinfo($file, PATHINFO_FILENAME);
            if (class_exists($class) && property_exists($class, 'type')) {

                if ($type == $class::$type) {
                    return new $class();
                }
            }
        }

        throw new InvalidArgumentException("Unsupported notification type [$type]");
    }
}
