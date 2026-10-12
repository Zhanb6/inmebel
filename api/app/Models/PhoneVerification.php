<?php

namespace App\Models;

use App\Observers\PhoneVerificationObserver;
use App\Traits\IsActive;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

#[ObservedBy([PhoneVerificationObserver::class])]
class PhoneVerification extends Model
{
    use HasFactory, SoftDeletes, Notifiable, IsActive;

    protected $fillable = [
        'phone',
        'code',
        'type',
        'channel',
        'confirmed_at',
        'next_request_at',
        'isActive',
    ];

    protected $casts = [
        'confirmed_at'=>'datetime',
        'next_request_at'=>'datetime',
    ];

    protected $appends = [
        'phone_converted'
    ];

    public function getPhoneConvertedAttribute()
    {
        return $this->phone;
    }
}
