<?php

namespace App\Enums;

enum RequestStatusEnum:int
{
    case NEW = 1;
    case ACCEPTING = 2;
    case MEASUREMENTS = 3;
    case MATERIAL_BUYING = 4;
    case FRAME_MAKING = 5;
    case FACADE_MAKING = 6;
    case ASSEMBLY = 7;
    case MOUNTING = 8;
    case ACCEPTING_CLIENT = 9;
    case FINISHED = 10;
    case ACCEPTING_CONTRACT = 11;
    case MAKING_CONTRACT = 12;
    case MAKING_WORK_REPORT = 13;
    case PAYING = 14;
    case PAYING_TEN = 15;


    public function role()
    {

        if ($this === static::ACCEPTING_CLIENT || $this === static::ACCEPTING_CONTRACT || $this === static::PAYING || $this === static::PAYING_TEN) {
            return RoleEnum::CLIENT->value;
        }


        return RoleEnum::WORKSHOP->value;
    }

    public static function finishedStatus()
    {
        return static::FINISHED;
    }
}
