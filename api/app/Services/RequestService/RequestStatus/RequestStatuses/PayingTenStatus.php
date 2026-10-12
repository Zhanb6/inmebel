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

class PayingTenStatus extends RequestStatusBase
{
    public static $type = RequestStatusEnum::PAYING_TEN;

    protected function handleTransition(RequestModel $requestModel,Request $request) {

        $data = $request->all();
        $validatedData = Validator::make($data, [
            'files'=>'nullable|array',
            'files.*'=>'nullable|file',
            'comment'=>'nullable|string',
        ])->validate();

        DB::transaction(function () use ($validatedData, $requestModel, $data) {
            $requestModel->update([
                'request_status_id'=> static::$type->value,
            ]);

            $history = $requestModel->histories()->firstOrCreate(['request_status_id'=>static::$type->value]);

            $history->update([
                'comment'=>@$validatedData['comment']
            ]);

            if (@$validatedData['files']) {
                foreach ($validatedData['files'] as $file) {
                    $history
                        ->addMedia($file)
                        ->toMediaCollection();
                }
            }
        });
    }

    public function refund(RequestModel $requestModel, Request $request)
    {
        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }
}
