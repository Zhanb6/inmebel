<?php

namespace App\Services\OrderService\OrderStatusService;

use App\Enums\OrderStatusEnum;
use App\Enums\RequestStatusEnum;
use App\Services\RequestService\RequestStatus\RequestStatusBase;
use Illuminate\Validation\ValidationException;

class OrderStatusFactory
{
    //реализация фабричного паттерна проектирование
    public static function make(?OrderStatusEnum $type): OrderStatusBase
    {
        $namespace = __NAMESPACE__ . '\OrderStatuses';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/OrderStatuses/*.php') as $file) {
            $class = $namespace . '\\' . pathinfo($file, PATHINFO_FILENAME);
            if (class_exists($class) && property_exists($class, 'type')) {

                if ($type == $class::$type) {
                    return new $class();
                }
            }
        }

        throw ValidationException::withMessages([
            'order_status' => 'Unsupported Order Status',
        ]);
    }
}
