<?php

namespace App\Http\Controllers\API\General;

use App\Enums\PaginationMetaEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductIndexResource;
use App\Http\Resources\Product\ProductShowResource;
use App\Http\Resources\WorkshopProduct\WorkshopProductGeneralIndexResource;
use App\Models\Product;

use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string',
            'perPage' => 'nullable|integer',
        ]);

        $productQuery = Product::query();
        $productQuery->with('categories','media','auth_user_like');
        $productQuery->withAvg('reviews','star');
        $productQuery->withCount('reviews');
        $productQuery->withCount('reviews_with_comment');
        $productQuery->latest();

        $productQuery = ProductService::filterQuery( $productQuery,$request->all());

        $products = $productQuery->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return ProductIndexResource::collection($products);
    }

    public function show(Product $product)
    {

        $product->loadAvg('reviews','star');
        $product->loadCount('reviews');
        $product->loadCount('reviews_with_comment');


        return new ProductShowResource($product);
    }
}
