<?php

namespace App\Enums;

use App\Traits\EnumTrait;

enum AttributeTypeEnum:string
{
    use EnumTrait;
    case TEXT = 'text';
    case INTEGER = 'integer';
    case BOOLEAN = 'boolean';
    case SELECT = 'select';
}
