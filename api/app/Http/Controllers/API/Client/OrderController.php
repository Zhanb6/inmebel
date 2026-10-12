<?php

namespace App\Http\Controllers\API\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\OrderIndexResource;
use App\Http\Resources\Order\OrderShowResource;
use App\Models\Order;
use App\Services\OrderService\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $data = Order::where('user_id', $request->user()->id)
            ->with('products','workshop')
            ->get();

        return OrderIndexResource::collection($data);
    }

    public function show(Request $request, Order $order)
    {
        check_access('view',$order);
        return new OrderShowResource($order);
    }


    public function make(Request $request)
    {
        OrderService::makeOrder($request);
        return response_success();
    }
}
