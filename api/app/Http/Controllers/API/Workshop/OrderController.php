<?php

namespace App\Http\Controllers\API\Workshop;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\OrderIndexResource;
use App\Http\Resources\Order\OrderShowResource;
use App\Models\Order;
use App\Services\OrderService\OrderStatusService\OrderStatusFactory;
use Illuminate\Http\Request;

class OrderController extends WorkshopBaseController
{
    public function index(Request $request)
    {

        $data = Order::where('workshop_id', $this->workshop?->id)
            ->with('products','workshop')
            ->get();

        return OrderIndexResource::collection($data);
    }

    public function show(Request $request, Order $order)
    {
        check_access('view',$order);

        return new OrderShowResource($order);
    }

    public function nextStatusUpdate(Request $request, Order $order)
    {
        check_access('update',$order);

        OrderStatusFactory::make($order->getNextStatusEnum())->changeStatus($order,$request);

        return new OrderShowResource($order->fresh());
    }
}
