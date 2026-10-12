<?php

namespace App\Http\Controllers\API\Client;

use App\Enums\FurnitureAddonDataTypeEnum;
use App\Enums\PhoneVerificationChannelEnum;
use App\Enums\RequestStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\RequestStoreRequest;


use App\Http\Requests\RequestModel\RequestModelClientStoreRequest;
use App\Http\Resources\Facade\FacadeListResource;
use App\Http\Resources\FurnitureType\FurnitureTypeListResource;
use App\Http\Resources\RequestModel\RequestModelResource;
use App\Http\Resources\RequestModel\RequestModelShowResource;
use App\Models\Brand;
use App\Models\Facade;
use App\Models\Filling;
use App\Models\Frame;
use App\Models\FurnitureAddon;
use App\Models\FurnitureSubtype;
use App\Models\FurnitureType;
use App\Models\RequestAddition;
use App\Models\RequestModel;
use App\Services\FurnitureService\Furniture\FurnitureFactory;
use App\Services\FurnitureService\FurnitureAddon\FurnitureAddonFactory;
use App\Services\PhoneVerificationService;
use App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatusFactory;
use App\Services\RequestService\RequestStatus\RequestStatusFactory;
use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $requests = $user->requests()->with('furniture_type','request_status','workshop')->latest()->get();

        return RequestModelResource::collection($requests);
    }

    public function show(Request $request,RequestModel $requestModel)
    {
        check_access('view',$requestModel);

        return new RequestModelShowResource($requestModel);
    }

    public function nextStatus(Request $request,RequestModel $requestModel)
    {
        check_access('view',$requestModel);

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

    public function store(RequestModelClientStoreRequest $request)
    {

        $user = $request->user();

        DB::transaction(function () use ($request, $user) {
            $data = $request->validated();
            $furniture = FurnitureFactory::make($request->furniture_type_id)->setData($request->all())->store();
            $furnitureLocal = FurnitureFactory::make($request->furniture_type_id)->localMode()->setData($request->all());

            $data['furniture_data_type'] = $furniture->getMorphClass();
            $data['furniture_data_id'] = $furniture->id;
            $data['price'] = $furnitureLocal->calculatePrice();
            $data['price_from'] = $furnitureLocal->calculatePriceFrom();
            $data['price_to'] = $furnitureLocal->calculatePriceTo();

            $data['client_iin'] = $user->client_data?->iin;
            $data['client_name'] = $user->name;
            $data['client_phone'] = $user->phone;
            $data['client_address'] = $user->client_data?->address;

            $requestModel = $user->requests()->create($data);

        });


        return response_success();
    }


     public function storeAdditions(RequestModelClientStoreRequest $request,RequestModel $requestModel)
    {

        $user = $request->user();

        DB::transaction(function () use ($requestModel, $request, $user) {
            $data = $request->validated();
            $furniture = FurnitureFactory::make($request->furniture_type_id)->setData($request->all())->store();
            $furnitureLocal = FurnitureFactory::make($request->furniture_type_id)->localMode()->setData($request->all());

            $data['furniture_data_type'] = $furniture->getMorphClass();
            $data['furniture_data_id'] = $furniture->id;
            $data['price'] = $furnitureLocal->calculatePrice();


            $requestModelAdditions = $requestModel->request_additions()->create($data);

        });


        return response_success();
    }



    public function requestAdditionNextStatusUpdate(Request $request, RequestModel $requestModel,RequestAddition $requestAddition)
    {

        check_access('update',$requestModel);
        check_access('update',$requestAddition);

        RequestAdditionStatusFactory::make($requestAddition->getNextStatusEnum())->changeStatus($requestAddition,$request);

        return new RequestModelShowResource($requestModel->fresh());
    }
}
