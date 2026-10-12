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

class FinishedStatus extends RequestAdditionStatusBase
{
    public static $type = RequestAdditionStatusEnum::FINISHED;

    protected function handleTransition(RequestAddition $requestAddition,Request $request)
    {

        DB::transaction(function () use ($requestAddition) {
            $requestAddition->update([
                'request_addition_status_id'=> static::$type->value,
            ]);

            $history = $requestAddition->histories()->firstOrCreate(['request_addition_status_id'=>static::$type->value]);

         });
    }

    public function refund(RequestAddition $requestAddition,Request $request)
    {
        throw ValidationException::withMessages([
            'id' => 'Нельзя сделать возврат этого статуса',
        ]);
    }
}
