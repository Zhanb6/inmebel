<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CartItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price_product',
    ];

    protected $casts = [
        'price_product'=>'double',
        'price_result'=>'double',
    ];

    public function getPriceResultAttribute()
    {
        return $this->price_product * $this->quantity;
    }

    public function cart(){
        return $this->belongsTo(Cart::class);
    }

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
