<?php

namespace App\Services\RequestService\RequestStatus\RequestStatuses;

use App\Enums\RequestStatusEnum;
use App\Http\Resources\RequestModel\RequestModelShowResource;
use App\Models\RequestModel;
use App\Models\RequestStatus;
use App\Services\RequestService\RequestStatus\RequestStatusBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AcceptingStatus extends RequestStatusBase
{
    public static $type = RequestStatusEnum::ACCEPTING;

    protected function handleTransition(RequestModel $requestModel,Request $request) {

        $data = $request->all();

        $requestModel->update([
            'request_status_id'=> static::$type->value,
        ]);
    }

    public function refund(RequestModel $requestModel, Request $request)
    {
        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }
}
