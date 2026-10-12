<?php

namespace App\Observers;

use App\Enums\PhoneVerificationChannelEnum;
use App\Models\PhoneVerification;

class PhoneVerificationObserver
{
    /**
     * Handle the PhoneVerification "created" event.
     */
    public function creating(PhoneVerification $phoneVerification): void
    {
        $phoneVerification->code = random_int(1000,9999);
        $phoneVerification->next_request_at = $this->nextRequestAt($phoneVerification);

    }

    public function created(PhoneVerification $phoneVerification)
    {
        if ($phoneVerification->channel == PhoneVerificationChannelEnum::SMS->value){
            $phoneVerification->notify(new \App\Notifications\PhoneNotification());
        }

    }
    /**
     * Handle the PhoneVerification "updated" event.
     */
    public function updated(PhoneVerification $phoneVerification): void
    {
        //
    }

    /**
     * Handle the PhoneVerification "deleted" event.
     */
    public function deleted(PhoneVerification $phoneVerification): void
    {
        //
    }

    /**
     * Handle the PhoneVerification "restored" event.
     */
    public function restored(PhoneVerification $phoneVerification): void
    {
        //
    }

    /**
     * Handle the PhoneVerification "force deleted" event.
     */
    public function forceDeleted(PhoneVerification $phoneVerification): void
    {
        //
    }

    public function nextRequestAt($phoneVerification)
    {
        $requestCount = PhoneVerification::where('phone',$phoneVerification->phone)
            ->whereDate('created_at','>', now()->subHour())->count();

        $delay = match ($requestCount) {
            0 => 0,
            1 => 0,
            2 => 30, // 30 секунд
            3 => 120, // 2 минуты
            4 => 300, // 5 минут
            5 => 3600, // 1 час
            default => 3600, // По умолчанию 1 час
        };


        return now()->addSeconds($delay);
    }
}
