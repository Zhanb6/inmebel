<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SignedMedia extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'media_id',
        'user_id',
        'user_phone',
        'user_name',
        'user_iin',
        'signed_phone',
        'signed_phone_code',
        'ip_address',
        'user_agent',
        'file_hash',
        'file_hash_method',
        'file',
        'file_mime_type',
        'file_name',
        'created_at',
        'updated_at',
    ];


}
