<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductIndexResource;
use App\Http\Resources\Product\ProductShowResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'perPage'=>'nullable|integer|min:1|max:100',
            'search'=>'nullable|string',
        ]);
        $query = Product::query();

        $query->filter($request->all());

        $query->orderByDesc('created_at')
            ->orderByDesc('id');

        $query->withAvg('reviews', 'star');
        $query->withCount('reviews');
        $query->withCount('reviews_with_comment');
        $query->with('categories','media');

        $count = $query->count();
        $data = $query->paginate($request->perPage ?? 10);

        return ProductIndexResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function show(Product $product)
    {

        $product->loadAvg('reviews','star');
        $product->loadCount('reviews');
        $product->loadCount('reviews_with_comment');

        return new ProductShowResource($product);
    }
}
