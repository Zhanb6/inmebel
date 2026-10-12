<?php

namespace App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatuses;

use App\Enums\RequestAdditionStatusEnum;
use App\Models\RequestAddition;
use App\Models\RequestAdditionStatus;
use App\Models\User;
use App\Services\DocumentService\DocumentSignService;
use App\Services\DocumentService\DocumentTemplates\Documents\RequestContractDocumentTemplate;
use App\Services\PhoneVerificationService;
use App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatusBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AcceptingWorkshopStatus extends RequestAdditionStatusBase
{
    public static $type = RequestAdditionStatusEnum::ACCEPTING_WORKSHOP;

    protected function handleTransition(RequestAddition $requestAddition,Request $request)
    {

        $data = $request->all();

        $getContract = $requestAddition->histories()->firstWhere('request_addition_status_id',RequestAdditionStatusEnum::MAKING_DOCUMENT->value)?->getFirstMedia();
        if (!$getContract){
            throw ValidationException::withMessages(['code' => 'Документ не найден попросите сгенерировать еще раз договор!']);
        }

        $validatedData = Validator::make($data, [
            'code'=>'required|integer',
        ])->validate();

        $requestModel = $requestAddition->request_model;

        $confirmed = PhoneVerificationService::confirm($requestModel->user->phone,$validatedData['code']);

        if (!$confirmed) {
            throw ValidationException::withMessages(['code' => 'Не верный код повторите еще раз!']);
        }

        DB::transaction(function () use ($validatedData, $getContract, $request, $requestModel, $requestAddition, $data) {
            $requestAddition->update([
                'request_addition_status_id'=> static::$type->value,
            ]);

            $history = $requestAddition->histories()->firstOrCreate(['request_addition_status_id'=>static::$type->value]);
            $user = User::find(Auth::id());
            DocumentSignService::signMedia($request,$getContract,$user,$user->phone,$validatedData['code'],'workshop');
         });
    }

    public function refund(RequestAddition $requestAddition,Request $request)
    {
        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }
}
