<?php

namespace App\Services\OrderService\OrderStatusService;

use App\Enums\OrderStatusEnum;
use App\Enums\RequestStatusEnum;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Support\Facades\Auth;

class OrderStatusService
{
    public static function getStatuses():array
    {
        return [
            OrderStatusEnum::PENDING,
            OrderStatusEnum::LEFT_FROM_SUPPLIER,
            OrderStatusEnum::DISTRIBUTION_POINT,
            OrderStatusEnum::IN_CITY,
            OrderStatusEnum::DELIVERY_SERVICE,
            OrderStatusEnum::DELIVERY,
        ];
    }

    public static function nextStatus(Order $order):?OrderStatusEnum
    {
        $statuses = static::getStatuses();

        $currentStatus = OrderStatusEnum::tryFrom($order->order_status_id);
        if ($currentStatus){

            $index = array_search($currentStatus, $statuses);

            if ($index !== false && isset($statuses[$index + 1])) {
                return $statuses[$index + 1];
            }
        }

        if ($currentStatus == OrderStatusEnum::DELIVERY){
            return null;
        }

        return reset($statuses);
    }

    public static function prevStatus(Order $order):?OrderStatusEnum
    {
        $statuses = static::getStatuses();

        $currentStatus = OrderStatusEnum::tryFrom($order->order_status_id);
        if ($currentStatus){

            $index = array_search($currentStatus, $statuses);

            if ($index !== false && isset($statuses[$index - 1])) {
                return $statuses[$index - 1];
            }
        }

        if ($currentStatus == OrderStatusEnum::PENDING){
            return null;
        }

        return reset($statuses);
    }

    public static function show(Order $order)
    {
        foreach (static::getStatuses() as $status) {
            $statusIds[] = $status->value;
        }

        $statuses = OrderStatus::all();

        $statusesOrdered = [];
        $history = $order->histories;



        foreach (static::getStatuses() as $status) {
            $getStatus = $statuses->where('id',$status->value)->first();
            $pass = $history->where('order_status_id',$getStatus?->id)->first();
            $statusesOrdered[] = [
                'id'=>$getStatus?->id,
                'name'=>$getStatus?->name,
                'passed_at'=>$pass?->created_at,
//                'comment'=>$pass?->comment,
//                'media'=>MediaResource::collection($pass?->media ?? []),
//                'pass'=>[
//                    'passed_at'=>$pass?->created_at,
//                    'comment'=>$pass?->comment
//                ],
            ];
        }


        return [

            'next_status'=>[
                'id'=>$statuses->firstWhere('id',static::nextStatus($order)?->value)?->id,
                'name'=>$statuses->firstWhere('id',static::nextStatus($order)?->value)?->name,
             ],
            'prev_status'=>[
                'id'=>$statuses->firstWhere('id',static::prevStatus($order)?->value)?->id,
                'name'=>$statuses->firstWhere('id',static::prevStatus($order)?->value)?->name,
             ],
            'data'=>$statusesOrdered
        ];
    }
}
