<?php

namespace App\Http\Controllers\API\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductIndexResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function reviewStore(Request $request,Product $product)
    {
        $request->validate([
            'star'=>'required|numeric|min:0|max:5',
            'comment'=>'nullable|string',
        ]);

        $user = $request->user();

        $review = $product->reviews()->create([
            'star'=>$request->star,
            'comment'=>$request->comment,
            'person_type'=>$user->getMorphClass(),
            'person_id'=>$user->id,
        ]);

        return response()->json([
            'data'=>$review,
        ]);
    }

    public function likeToggle(Product $product)
    {

        if (!$product->auth_user_like){
            $product->auth_user_like()->create();
        } else{
            $product->auth_user_like()->delete();
        }

        return response_success();
    }

    public function likedProducts(Request $request)
    {
        $products = Product::query()
            ->withAvg('reviews', 'star')
            ->withCount('reviews')
            ->withCount('reviews_with_comment')
            ->whereHas('auth_user_like')->get();

        return ProductIndexResource::collection($products);
    }
}
