<?php

namespace App\Services\RequestService\RequestStatus;


use App\Enums\RequestStatusEnum;
use App\Models\FurnitureType;
use App\Models\RequestModel;
use App\Models\RequestStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

abstract class RequestStatusBase
{
    public static $type;

    protected abstract function handleTransition(RequestModel $requestModel,Request $request);

    abstract public function refund(RequestModel $requestModel, Request $request);

    public function changeStatus(RequestModel $requestModel,Request $request)
    {
        check_access('update',$requestModel);

        if ($requestModel->request_status_id == RequestStatusEnum::FINISHED->value){
            return throw ValidationException::withMessages( ['request_status_id' => 'Заявка завершена!']);
        }

        if (!Auth::user()?->hasRole(static::$type->role())){
            check_access_bool(false);
        }

        $this->handleTransition($requestModel,$request);
    }
}
