<?php

namespace App\Services\FurnitureService\FurnitureStatus;


use InvalidArgumentException;

class FurnitureStatusFactory
{
    //реализация фабричного паттерна проектирование
    public static function make(string $type): FurnitureStatusBase
    {
        $namespace = __NAMESPACE__ . '\FurnitureStatuses';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/FurnitureStatuses/*.php') as $file) {
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
