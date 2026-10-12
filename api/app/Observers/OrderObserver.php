<?php

namespace App\Observers;

use App\Enums\OrderStatusEnum;
use App\Enums\RequestStatusEnum;
use App\Models\Order;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function creating(Order $order): void
    {
        if (!$order->order_status_id){
            $order->order_status_id = OrderStatusEnum::PENDING->value;
        }
    }

    public function created(Order $order): void
    {
        $order->histories()->updateOrCreate([
            'order_status_id'=>$order->order_status_id,
        ]);
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->wasChanged('order_status_id')) {
            $order->histories()->updateOrCreate([
                'order_status_id' => $order->order_status_id,
            ]);
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        //
    }
}
