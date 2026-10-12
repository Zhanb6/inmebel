<?php

namespace App\Enums;

enum OrderStatusEnum:int
{
    case PENDING = 1;
    case LEFT_FROM_SUPPLIER = 2;
    case DISTRIBUTION_POINT = 3;
    case IN_CITY = 4;
    case DELIVERY_SERVICE = 5;
    case DELIVERY = 6;

    public static function finishedStatus()
    {
        return static::DELIVERY;
    }
}
