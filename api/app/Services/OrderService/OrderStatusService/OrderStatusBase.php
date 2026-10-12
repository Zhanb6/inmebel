<?php

namespace App\Services\OrderService\OrderStatusService;

use App\Enums\OrderStatusEnum;
use App\Enums\RequestStatusEnum;
use App\Http\Resources\Media\MediaResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\RequestModel;
use App\Services\OrderService\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

abstract class OrderStatusBase
{
    public static $type;
    protected $currentStatus;

    protected abstract function handleTransition(Order $order,Request $request);
    public abstract function refund(Order $order,Request $request);

    public function changeStatus(Order $order,Request $request)
    {
        check_access('update',$order);

//        if ($order->request_status_id == RequestStatusEnum::FINISHED->value){
//            return throw ValidationException::withMessages( ['request_status_id' => 'Заявка завершена!']);
//        }

//        if (!Auth::user()?->hasRole(static::$type->role())){
//            check_access_bool(false);
//        }

        $this->handleTransition($order,$request);
    }




}
