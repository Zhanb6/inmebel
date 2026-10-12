<?php

namespace App\Observers;

use App\Enums\RequestStatusEnum;
use App\Models\RequestModel;

class RequestModelObserver
{
    /**
     * Handle the RequestModel "created" event.
     */
    public function creating(RequestModel $requestModel): void
    {
        if (!$requestModel->request_status_id){
            $requestModel->request_status_id = RequestStatusEnum::NEW->value;
        }
    }

    public function created(RequestModel $requestModel): void
    {
        $requestModel->histories()->updateOrCreate([
            'request_status_id'=>$requestModel->request_status_id,
        ]);
    }

    /**
     * Handle the RequestModel "updated" event.
     */
    public function updated(RequestModel $requestModel): void
    {
        if ($requestModel->wasChanged('request_status_id')) {
            $requestModel->histories()->updateOrCreate([
                'request_status_id' => $requestModel->request_status_id,
            ]);
        }

    }

    /**
     * Handle the RequestModel "deleted" event.
     */
    public function deleted(RequestModel $requestModel): void
    {
        //
    }

    /**
     * Handle the RequestModel "restored" event.
     */
    public function restored(RequestModel $requestModel): void
    {
        //
    }

    /**
     * Handle the RequestModel "force deleted" event.
     */
    public function forceDeleted(RequestModel $requestModel): void
    {
        //
    }
}
