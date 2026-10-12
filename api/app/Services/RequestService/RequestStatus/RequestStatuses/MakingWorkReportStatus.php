<?php

namespace App\Services\RequestService\RequestStatus\RequestStatuses;

use App\Enums\RequestStatusEnum;
use App\Models\RequestModel;
use App\Models\User;
use App\Services\DocumentService\DocumentSignService;
use App\Services\DocumentService\DocumentTemplates\Documents\RequestContractDocumentTemplate;
use App\Services\DocumentService\DocumentTemplates\Documents\RequestWorkReportDocumentTemplate;
use App\Services\PhoneVerificationService;
use App\Services\RequestService\RequestService;
use App\Services\RequestService\RequestStatus\RequestStatusBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class MakingWorkReportStatus extends RequestStatusBase
{
    public static $type = RequestStatusEnum::MAKING_WORK_REPORT;

    protected function handleTransition(RequestModel $requestModel,Request $request) {

        $data = $request->all();

        $contractService = new RequestWorkReportDocumentTemplate($requestModel);

        $generatedFile = $contractService->generate();

        DB::transaction(function () use ($request, $generatedFile, $requestModel, $data) {

            //обновление статуса и сохранение акта выполненных работ
            $requestModel->update([
                'request_status_id'=> static::$type->value,
            ]);

            $history = $requestModel->histories()->firstOrCreate(['request_status_id'=>static::$type->value]);

            if ($generatedFile) {
                $history
                    ->addMedia($generatedFile)
                    ->toMediaCollection();

//                unlink($generatedFile);
            }

            //подпись исполнителя
            $getContract = $history?->getFirstMedia();
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

            $user = User::find(Auth::id());

            DocumentSignService::signMedia($request,$getContract,$user,$user->phone,$validatedData['code'],'workshop');

        });

    }

    public function refund(RequestModel $requestModel, Request $request)
    {
        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }
}
