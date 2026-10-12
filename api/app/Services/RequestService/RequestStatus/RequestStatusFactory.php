<?php

namespace App\Services\RequestService\RequestStatus;


use App\Enums\RequestStatusEnum;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class RequestStatusFactory
{
    //реализация фабричного паттерна проектирование
    public static function make(?RequestStatusEnum $type): RequestStatusBase
    {
        $namespace = __NAMESPACE__ . '\RequestStatuses';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/RequestStatuses/*.php') as $file) {
            $class = $namespace . '\\' . pathinfo($file, PATHINFO_FILENAME);
            if (class_exists($class) && property_exists($class, 'type')) {

                if ($type == $class::$type) {
                    return new $class();
                }
            }
        }

        throw ValidationException::withMessages([
            'request_status' => 'Unsupported Request Status',
        ]);
    }
}
