<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartService
{
    public function getCart()
    {
        return Cart::firstOrCreate(['user_id' => auth()->id()]);
    }

    public function add($productId, $qty = 1)
    {
        $cart = $this->getCart();

        $item = $cart->items()->where('product_id', $productId)->first();

        if ($item) {
            $item->quantity += $qty;
            $item->save();
        } else {
            $product = Product::findOrFail($productId);

            $cart->items()->create([
                'product_id' => $productId,
                'quantity' => $qty,
                'price_product' => $product->price,
            ]);
        }

        return $cart->load('items.product');
    }

    public function updateQty($itemId, $qty)
    {
        $item = CartItem::findOrFail($itemId);
        $item->update(['quantity' => $qty]);
    }

    public function remove($itemId)
    {
        CartItem::findOrFail($itemId)->delete();
    }

    public function clear()
    {
        $this->getCart()?->items()?->delete();
    }
}
