<?php

namespace App\Services\RequestAdditionService\RequestAdditionStatusService;

use App\Enums\RequestAdditionStatusEnum;
use Illuminate\Validation\ValidationException;

class RequestAdditionStatusFactory
{
    public static function make(?RequestAdditionStatusEnum $type): RequestAdditionStatusBase
    {
        $namespace = __NAMESPACE__ . '\RequestAdditionStatuses';

        // Получаем все классы из папки Widgets
        foreach (glob(__DIR__ . '/RequestAdditionStatuses/*.php') as $file) {
            $class = $namespace . '\\' . pathinfo($file, PATHINFO_FILENAME);
            if (class_exists($class) && property_exists($class, 'type')) {

                if ($type == $class::$type) {
                    return new $class();
                }
            }
        }

        throw ValidationException::withMessages([
            'order_status' => 'Unsupported Request additions Status',
        ]);
    }
}
