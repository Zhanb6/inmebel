<?php

namespace App\Http\Controllers\API\Admin;

use App\Enums\OrderStatusEnum;
use App\Enums\RequestStatusEnum;
use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\RequestModel;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {

        //Пользователи
        $usersCount = User::all()->count();
        $workShopsQuery =  User::query()->whereHas('roles',function ($query){
            $query->where('name',RoleEnum::WORKSHOP->value);
        });
        $clientsQuery =  User::query()->whereHas('roles',function ($query){
            $query->where('name',RoleEnum::CLIENT->value);
        });
        $workShopsCount = $workShopsQuery->clone()->count();
        $workShopsAcceptedCount = $workShopsQuery->clone()->whereHas('workshop',function ($query){
            $query->whereNotNull('accepted_at');
        })->count();
        $clientsCount = $clientsQuery->clone()->count();

        //Заявки
        $requestQuery = RequestModel::query();
        $requestCount = $requestQuery->clone()->count();
        $requestPriceSum = $requestQuery->clone()->sum('price');
        $requestFinishedPriceSum = $requestQuery->clone()->where('request_status_id',RequestStatusEnum::finishedStatus()->value)->sum('price');

        //Заказы
        $orderQuery = Order::query();
        $orderCount = $orderQuery->clone()->count();
        $orderPriceSum = $orderQuery->clone()->sum('price');
        $orderFinishedPriceSum = $orderQuery->clone()->where('order_status_id',OrderStatusEnum::finishedStatus()->value)->sum('price');

        return response()->json([
            'data'=>compact(
                'usersCount',
                'workShopsCount',
                'workShopsAcceptedCount',
                'clientsCount',
                'requestCount',
                'requestPriceSum',
                'requestFinishedPriceSum',
                'orderCount',
                'orderPriceSum',
                'orderFinishedPriceSum'
            )
        ]);
    }
}
