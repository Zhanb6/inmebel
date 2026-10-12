<?php

namespace App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatuses;

use App\Enums\RequestAdditionStatusEnum;
use App\Models\RequestAddition;
use App\Models\RequestAdditionStatus;
use App\Models\User;
use App\Services\DocumentService\DocumentSignService;
use App\Services\DocumentService\DocumentTemplates\Documents\RequestAdditionalContractDocumentTemplate;
use App\Services\DocumentService\DocumentTemplates\Documents\RequestContractDocumentTemplate;
use App\Services\PhoneVerificationService;
use App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatusBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class MakingDocumentStatus extends RequestAdditionStatusBase
{
    public static $type = RequestAdditionStatusEnum::MAKING_DOCUMENT;

    protected function handleTransition(RequestAddition $requestAddition,Request $request)
    {

        $data = $request->all();

        $requestModel = $requestAddition->request_model;
        $contractService = new RequestAdditionalContractDocumentTemplate($requestAddition);
        $generatedFile = $contractService->generate();


        DB::transaction(function () use ($request, $requestModel, $generatedFile, $requestAddition, $data) {
            $requestAddition->update([
                'request_addition_status_id'=> static::$type->value,
            ]);

            $history = $requestAddition->histories()->firstOrCreate(['request_addition_status_id'=>static::$type->value]);

            if ($generatedFile) {
                $history
                    ->addMedia($generatedFile)
                    ->toMediaCollection();

//                unlink($generatedFile);
            }

            $getContract = $history?->getFirstMedia();

            if (!$getContract){
                throw ValidationException::withMessages(['code' => 'Доп соглашение не найден попробуйте еще раз!']);
            }

            $validatedData = Validator::make($data, [
                'code'=>'required|integer',
            ])->validate();

            $confirmed = PhoneVerificationService::confirm($requestModel->user->phone,$validatedData['code']);

            if (!$confirmed) {
                throw ValidationException::withMessages(['code' => 'Не верный код повторите еще раз!']);
            }

            $user = User::find(Auth::id());

            DocumentSignService::signMedia($request,$getContract,$user,$user->phone,$validatedData['code']);
        });
    }

    public function refund(RequestAddition $requestAddition,Request $request)
    {
        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }
}
