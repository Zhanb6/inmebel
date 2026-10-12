<?php

namespace App\Services;

use App\Models\PhoneVerification;
use App\Models\User;

class PhoneVerificationService
{
    public static function confirm($phone, $code)
    {

        if ($lastPhoneVerification = static::lastPhoneVerification($phone)){
            if ($lastPhoneVerification->code == $code){
                return static::confirmPhoneVerification($lastPhoneVerification);
            }
        }

        return null;
    }

    public static function confirmPhoneVerification(PhoneVerification $phoneVerification)
    {
        PhoneVerification::where('phone',$phoneVerification->phone)->update([
            'isActive'=>0
        ]);

        return $phoneVerification->update([
            'confirmed_at'=>now()
        ]);
    }

    public static function lastPhoneVerification($phone)
    {
        return PhoneVerification::where('phone',$phone)->active()->latest()->whereNull('confirmed_at')?->first();
    }

    public static function newVerification($phone,$channel = null,$type = null)
    {

        $lastVerification = static::lastPhoneVerification($phone);

        if ($lastVerification && $lastVerification->next_request_at > now()){
            throw \Illuminate\Validation\ValidationException::withMessages([
                'phone'=>'Слишком много запросов повторите попытку '.$lastVerification->next_request_at->diffForHumans()
            ]);
        }

        return PhoneVerification::create(['phone'=>$phone,'channel'=>$channel]);
    }
}
