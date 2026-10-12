<?php

namespace App\Observers;

use App\Enums\RequestAdditionStatusEnum;
use App\Models\RequestAddition;

class RequestAdditionObserver
{
    /**
     * Handle the RequestAddition "created" event.
     */
    public function creating(RequestAddition $requestAddition): void
    {
        if (!$requestAddition->request_addition_status_id){
            $requestAddition->request_addition_status_id = RequestAdditionStatusEnum::NEW->value;
        }

        if (!$requestAddition->number){
            $requestAddition->number = ($requestAddition->request_model?->request_additions()?->count() ?? 0)+1;
        }


    }

    public function created(RequestAddition $requestAddition): void
    {
        $requestAddition->histories()->updateOrCreate([
            'request_addition_status_id'=>$requestAddition->request_addition_status_id,
        ]);
    }

    /**
     * Handle the RequestAddition "updated" event.
     */
    public function updated(RequestAddition $requestAddition): void
    {
        if ($requestAddition->wasChanged('request_addition_status_id')) {
            $requestAddition->histories()->updateOrCreate([
                'request_addition_status_id'=>$requestAddition->request_addition_status_id,
            ]);
        }
    }

    /**
     * Handle the RequestAddition "deleted" event.
     */
    public function deleted(RequestAddition $requestAddition): void
    {
        //
    }

    /**
     * Handle the RequestAddition "restored" event.
     */
    public function restored(RequestAddition $requestAddition): void
    {
        //
    }

    /**
     * Handle the RequestAddition "force deleted" event.
     */
    public function forceDeleted(RequestAddition $requestAddition): void
    {
        //
    }
}
