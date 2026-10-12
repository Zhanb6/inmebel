<?php

namespace App\Services\RequestAdditionService\RequestAdditionStatusService;

use App\Enums\RequestAdditionStatusEnum;
use App\Enums\RequestStatusEnum;
use App\Models\Order;
use App\Models\RequestAddition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

abstract class RequestAdditionStatusBase
{
    public static $type;
    protected $currentStatus;

    protected abstract function handleTransition(RequestAddition $requestAddition,Request $request);
    public abstract function refund(RequestAddition $requestAddition,Request $request);

    public function changeStatus( RequestAddition $requestAddition,Request $request)
    {

        if ($requestAddition->request_addition_status_id == RequestAdditionStatusEnum::FINISHED->value){
            return throw ValidationException::withMessages( ['request_addition_status_id' => 'Заявка завершена!']);
        }

        if (!Auth::user()?->hasRole(static::$type->role())){
            check_access_bool(false);
        }
//        if ($order->request_status_id == RequestStatusEnum::FINISHED->value){
//            return throw ValidationException::withMessages( ['request_status_id' => 'Заявка завершена!']);
//        }

//        if (!Auth::user()?->hasRole(static::$type->role())){
//            check_access_bool(false);
//        }

        $this->handleTransition($requestAddition,$request);
    }

}
