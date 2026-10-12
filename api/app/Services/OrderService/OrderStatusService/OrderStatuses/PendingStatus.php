<?php

namespace App\Services\OrderService\OrderStatusService\OrderStatuses;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Services\OrderService\OrderStatusService\OrderStatusBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PendingStatus extends OrderStatusBase
{
    public static $type = OrderStatusEnum::PENDING;

    protected function handleTransition(Order $order,Request $request)
    {

        $data = $request->all();

        DB::transaction(function () use ($order, $data) {
            $order->update([
                'order_status_id'=> static::$type->value,
            ]);

            $history = $order->histories()->firstOrCreate(['order_status_id'=>static::$type->value]);



        });
    }

    public function refund(Order $order,Request $request)
    {
        $prevStatus =  $order->getPrevStatusEnum();


        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }
}
