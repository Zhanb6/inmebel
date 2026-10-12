<?php

namespace App\Http\Controllers\API\Admin;

use App\Enums\PaginationMetaEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\RequestModel\RequestModelResource;
use App\Http\Resources\RequestModel\RequestModelShowResource;
use App\Models\RequestModel;
use App\Services\RequestService\RequestStatus\RequestStatusFactory;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'perPage'=>'nullable|integer|min:1|max:100',
            'search'=>'nullable|string',
        ]);

        $query = RequestModel::query();
        $query->with('furniture_type','request_status','workshop')
            ->latest();

        //filters
        $query->filter($request->all());

        $count = $query->clone()->count();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return RequestModelResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function show(Request $request,RequestModel $requestModel)
    {

        return new RequestModelShowResource($requestModel);
    }

    public function prevStatusUpdate(Request $request,RequestModel $requestModel)
    {

        RequestStatusFactory::make($requestModel->getCurrentStatusEnum())->refund($requestModel,$request);

        return new RequestModelShowResource($requestModel->fresh());
    }
}
