<?php

namespace App\Http\Controllers\API\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Cart\CartShowResource;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(CartService $cartService)
    {
        $cart = $cartService->getCart()?->load('items.product');

        return new CartShowResource($cart);
    }

    public function add(Request $request, CartService $cartService)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:App\Models\Product,id',
            'quantity' => 'required|integer'
        ]);
        $cart =  $cartService->add($request->product_id, $request->quantity ?? 1);
        return new CartShowResource($cart);
    }

    public function update(Request $request, CartService $cartService)
    {
        $request->validate([
            'cart_item_id' => 'required|integer|exists:App\Models\CartItem,id',
            'quantity' => 'required|integer',
        ]);

        $item = CartItem::findOrFail($request->cart_item_id);

        check_access('update',$item);

        $cartService->updateQty($request->cart_item_id, $request->quantity);

        return response_success();
    }

    public function remove(CartItem $cartItem, CartService $cartService)
    {
        check_access('update',$cartItem);

        $cartService->remove($cartItem->id);

        return response_success();
    }

    public function clear(CartService $cartService)
    {
        $cartService->clear();

        return response_success();
    }
}
