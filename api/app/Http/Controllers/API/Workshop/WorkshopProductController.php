<?php

namespace App\Http\Controllers\API\Workshop;

use App\Enums\AttributeTypeEnum;
use App\Enums\PaginationMetaEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Workshop\WorkshopProductStoreRequest;
use App\Http\Requests\Workshop\WorkshopProductUpdateRequest;
use App\Http\Resources\Product\ProductIndexResource;
use App\Http\Resources\Product\ProductShowResource;
use App\Http\Resources\WorkshopProduct\WorkshopProductWorkshopIndexResource;
use App\Http\Resources\WorkshopProduct\WorkshopProductWorkshopShowResource;
use App\Models\Attribute;
use App\Models\Workshop;
use App\Models\Product;
use App\Services\AttributeService\Types\AttributeFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WorkshopProductController extends WorkshopBaseController
{
    public function index(Request $request)
    {
        $request->validate([
            'search'=>'nullable|string',
        ]);
        $query = Product::query();
        $query->where('workshop_id', $this->workshop?->id);
        $query->when($request->search,function ($query,$data) use ($request){
            $query->where('name','ilike',"%{$data}%");
        })
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        $query->withAvg('reviews', 'star');
        $query->withCount('reviews');
        $query->withCount('reviews_with_comment');
        $query->with('categories','media');

        $data = $query->paginate($request->perPage ?? 10);

        return ProductIndexResource::collection($data);
    }

    public function store(WorkshopProductStoreRequest $request)
    {
        $product = null;
        DB::transaction(function () use ($request,&$product) {
            $product = $this->workshop?->products()?->create($request->validated());

            if ($request->images){
                foreach ($request->images as $image){
                    $product
                        ->addMedia($image)
                        ->toMediaCollection();
                }
            }

            if ($attributes = $request->post('attributes')){
                foreach ($attributes as $key => $attribute){
                    $attributeType = Attribute::find($attribute['id'])?->type ??  throw ValidationException::withMessages( ['attributes.'.$key.'.id' => 'Для аттрибута тип не найден']);
                    AttributeFactory::make(AttributeTypeEnum::tryFrom($attributeType))->setData($attribute)->saveToProduct($product);
                }
            }


            $product->categories()->sync($request->categories);

        });


        return new WorkshopProductWorkshopShowResource($product);
    }

    public function update(WorkshopProductUpdateRequest $request, Product $product)
    {
        check_access('update', $product);

        DB::transaction(function () use ($request, $product) {
            $product->update($request->validated());

            if ($request->images){
                foreach ($request->images as $image){
                    $product
                        ->addMedia($image)
                        ->toMediaCollection();
                }
            }

            $product->attributes()->forceDelete();
            if ($attributes = $request->post('attributes')){
                foreach ($attributes as $key => $attribute){
                    $attributeType = Attribute::find($attribute['id'])?->type ??  throw ValidationException::withMessages( ['attributes.'.$key.'.id' => 'Для аттрибута тип не найден']);
                    AttributeFactory::make(AttributeTypeEnum::tryFrom($attributeType))->setData($attribute)->saveToProduct($product);
                }
            }

            $product->categories()->sync($request->categories);
        });
        return new ProductShowResource($product);
    }

    public function show(Product $product)
    {
        check_access('view', $product);

        $product->loadAvg('reviews','star');
        $product->loadCount('reviews');
        $product->loadCount('reviews_with_comment');
        
         return new ProductShowResource($product);
    }

    public function destroyMedia(Product $product,$id)
    {
        check_access('update', $product);
        $product->media()->firstWhere('id', $id)?->delete();

        return response_success();
    }

    public function destroy(Product $product)
    {

        check_access('delete', $product);

        $product->delete();

        return response_success();
    }
}
