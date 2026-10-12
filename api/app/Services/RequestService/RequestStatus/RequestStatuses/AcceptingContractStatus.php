<?php

namespace App\Services\RequestService\RequestStatus\RequestStatuses;

use App\Enums\RequestStatusEnum;
use App\Http\Resources\RequestModel\RequestModelShowResource;
use App\Models\RequestModel;
use App\Models\RequestStatus;
use App\Services\DocumentService\DocumentSignService;
use App\Services\PhoneVerificationService;
use App\Services\RequestService\RequestStatus\RequestStatusBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AcceptingContractStatus extends RequestStatusBase
{
    public static $type = RequestStatusEnum::ACCEPTING_CONTRACT;

    protected function handleTransition(RequestModel $requestModel,Request $request) {

        $data = $request->all();

        $getContract = $requestModel->histories()->firstWhere('request_status_id',RequestStatusEnum::MAKING_CONTRACT->value)?->getFirstMedia();
        if (!$getContract){
            throw ValidationException::withMessages(['code' => 'Договор не найден попросите цех сгенерировать еще раз договор!']);
        }

        $validatedData = Validator::make($data, [
            'code'=>'required|integer',
        ])->validate();

        $confirmed = PhoneVerificationService::confirm($requestModel->user->phone,$validatedData['code']);

        if (!$confirmed) {
            throw ValidationException::withMessages(['code' => 'Не верный код повторите еще раз!']);
        }

        DB::transaction(function () use ($getContract, $request, $validatedData, $requestModel, $data) {
            $requestModel->update([
                'request_status_id'=> static::$type->value,
            ]);

            $history = $requestModel->histories()->firstOrCreate(['request_status_id'=>static::$type->value]);

            DocumentSignService::signMedia($request,$getContract,$requestModel->user,$requestModel->user->phone,$validatedData['code']);

        });

    }
    public function refund(RequestModel $requestModel, Request $request)
    {
        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }

}
