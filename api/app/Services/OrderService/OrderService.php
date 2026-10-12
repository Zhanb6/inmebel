<?php

namespace App\Services\OrderService;
use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public static function makeOrder(Request $request)
    {
        $user = $request->user();


        if (!$user->cart || !$user->cart->items()->count()) {
            throw ValidationException::withMessages( ['items' => 'Ваша корзина пуста']);
        }

        $items = $user?->cart?->items()->join('products', 'products.id', '=', 'cart_items.product_id')->select('cart_items.*','products.workshop_id')->get();

        $items->groupBy('workshop_id')->each(function ($items, $workshopId) use ($user) {
            $price = 0;
            $orderProduct = [];
            $items->each(function ($item) use (&$price,&$orderProduct) {
                $price += $item->price_result;

                $orderProduct[][$item->product_id] = [
                    'price'=>$item->price_product,
                    'quantity'=>$item->quantity,
                ];
            });

            DB::transaction(function () use ($user, $workshopId, $price, $orderProduct) {
                $order = Order::create([
                    'workshop_id'=>$workshopId,
                    'user_id'=>$user->id,
                    'order_status_id'=>OrderStatusEnum::PENDING->value,
                    'price'=>$price,
                ]);

                foreach ($orderProduct as $item) {
                    $order->products()->attach($item);
                }
            });
        });

        $cartService = new CartService();
        $cartService->clear();
    }
}
