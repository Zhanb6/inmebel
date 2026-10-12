<?php

namespace App\Enums;

enum RequestAdditionStatusEnum:int
{
    case NEW = 1;
    case MAKING_DOCUMENT = 2;
    case ACCEPTING_WORKSHOP = 3;
    case PAYING = 4;
    case FINISHED = 5;


    public function role()
    {

        if ($this === static::ACCEPTING_WORKSHOP) {
            return RoleEnum::WORKSHOP->value;
        }


        return RoleEnum::CLIENT->value;
    }

    public static function finishedStatus()
    {
        return static::FINISHED;
    }

}
