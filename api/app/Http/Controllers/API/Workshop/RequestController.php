<?php

namespace App\Http\Controllers\API\Workshop;

use App\Enums\PhoneVerificationChannelEnum;
use App\Enums\RequestStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\RequestModel\RequestModelResource;
use App\Http\Resources\RequestModel\RequestModelShowResource;
use App\Models\RequestAddition;
use App\Models\RequestModel;
use App\Services\PhoneVerificationService;
use App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatusFactory;
use App\Services\RequestService\RequestStatus\RequestStatusFactory;
use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RequestController extends WorkshopBaseController
{
    public function index(Request $request)
    {
        $requests = RequestModel::where('workshop_id',$this->workshop?->id)
            ->with('furniture_type','request_status','workshop')->latest()->get();

        return RequestModelResource::collection($requests);
    }

    public function show(Request $request,RequestModel $requestModel)
    {

        check_access('view',$requestModel);

        return new RequestModelShowResource($requestModel);
    }

    public function nextStatusUpdate(Request $request,RequestModel $requestModel)
    {
        check_access('update',$requestModel);

        RequestStatusFactory::make($requestModel->getNextStatusEnum())->changeStatus($requestModel,$request);

        return new RequestModelShowResource($requestModel);
    }

    public function sendCodeToAcceptContract(Request $request,RequestModel $requestModel)
    {
        check_access('view',$requestModel);

//        check_access_bool($requestModel->getNextStatusEnum() == RequestStatusEnum::ACCEPTING_CONTRACT);
        $smscService = app(SmsServiceInterface::class);


        $phoneVerification = PhoneVerificationService::newVerification($requestModel->user->phone,PhoneVerificationChannelEnum::SMS->value);

        return response()->json([
            'data'=>[
                'code'=>$phoneVerification->code,
            ]
        ]);
    }

    public function requestAdditionNextStatusUpdate(Request $request, RequestModel $requestModel,RequestAddition $requestAddition)
    {

        check_access('update',$requestModel);
        check_access('update',$requestAddition);

        RequestAdditionStatusFactory::make($requestAddition->getNextStatusEnum())->changeStatus($requestAddition,$request);

        return new RequestModelShowResource($requestModel->fresh());
    }

}
