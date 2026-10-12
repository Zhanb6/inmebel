<?php

namespace App\Http\Controllers\API\Admin;

use App\Enums\PaginationMetaEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Order\OrderIndexResource;
use App\Http\Resources\Order\OrderShowResource;
use App\Http\Resources\RequestModel\RequestModelShowResource;
use App\Models\Order;
use App\Models\RequestModel;
use App\Services\OrderService\OrderStatusService\OrderStatusFactory;
use App\Services\RequestService\RequestStatus\RequestStatusFactory;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'perPage' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string',
        ]);

        $query = Order::query();
        $query->with('products','workshop');

        //filters
        $query->filter($request->all());


        $count = $query->clone()->count();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return OrderIndexResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function show(Request $request, Order $order)
    {

        return new OrderShowResource($order);
    }

    public function prevStatusUpdate(Request $request,Order $order)
    {
        if ($order->getPrevStatusEnum()){
            OrderStatusFactory::make($order->getCurrentStatusEnum())->refund($order,$request);

        } else{
            throw ValidationException::withMessages( ['id' => 'Предыдущий статус не найден!']);

        }

        return new OrderShowResource($order->fresh());
    }

}
