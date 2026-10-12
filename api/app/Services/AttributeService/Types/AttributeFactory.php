<?php

namespace App\Services\AttributeService\Types;

use App\Enums\AttributeTypeEnum;
use InvalidArgumentException;

class AttributeFactory
{
    //реализация фабричного паттерна проектирование
    public static function make(AttributeTypeEnum $type): AttributeBase
    {
        $namespace = __NAMESPACE__ . '\Types';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/Types/*.php') as $file) {
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
