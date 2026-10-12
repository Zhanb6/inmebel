<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum RoleEnum: string
{
    use EnumTrait;
    case ADMIN = 'admin';
    case WORKSHOP = 'workshop';
    case SELLER = 'seller';
    case CLIENT = 'client';

    public function getId(): string
    {
        return match($this) {
            static::ADMIN => 1,
            static::WORKSHOP => 2,
        };
    }

    public function getName(): string
    {
        return match($this) {
            static::ADMIN => __('admin'),
            static::WORKSHOP => __('workshop'),
            static::SELLER => __('seller'),
            static::CLIENT => __('client'),
        };
    }
}
