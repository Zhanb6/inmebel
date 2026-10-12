<?php

namespace App\Http\Controllers\API\Admin;

use App\Enums\AttributeTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Attribute\AttributeListResource;
use App\Models\Attribute;
use App\Models\AttributeVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AttributeController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string',
        ]);

        $query = Attribute::query();

        $query->orderBy('name')
            ->with('categories');

        //filters
        $query->when($request->search, function ($query, $search) {
            $query->where('name', 'like', '%' . $search . '%');
            $query->orWhere('id','ilike','%'.$search.'%');
        });

        $data = $query->get();

        $count = $query->clone()->count();

        return AttributeListResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type'=>'required|string|in:'.AttributeTypeEnum::toValidation(),
            'variants'=>'required_if:type,'.AttributeTypeEnum::SELECT->value,
            'variants.*.value'=>'required|string',
        ]);

        $attribute = null;
        DB::transaction(function () use ($request,&$attribute) {
           $attribute = Attribute::create([
               'name'=>$request->name,
               'type'=>$request->type,
           ]);

           if ($request->variants){
                $attribute->variants()->createMany($request->variants);
           }
        });

        return new AttributeListResource($attribute);
    }

    public function update(Request $request, Attribute $attribute)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        DB::transaction(function () use ($request,&$attribute) {
            $attribute->update([
                'name'=>$request->name,
            ]);
        });

        return new AttributeListResource($attribute);
    }

    public function destroy(Request $request, Attribute $attribute)
    {
        $attribute->delete();

        return response_success();
    }

    public function updateVariant(Request $request, Attribute $attribute,AttributeVariant $attributeVariant)
    {
        $this->isTypeVariant($attribute);
        $request->validate([
           'value'=>'required|string',
        ]);

        DB::transaction(function () use ($attributeVariant, $request,&$attribute) {
            $variant = $attribute->variants()->findOrFail($attributeVariant->id);

            $variant->update([
                'value'=>$request->value,
            ]);
        });

        return new AttributeListResource($attribute);
    }

    public function destroyVariant(Request $request, Attribute $attribute,AttributeVariant $attributeVariant)
    {
        $this->isTypeVariant($attribute);
        $request->validate([
           'value'=>'required|string',
        ]);

        DB::transaction(function () use ($attributeVariant, $request,&$attribute) {
            $variant = $attribute->variants()->findOrFail($attributeVariant->id);

            $variant->delete();
        });

        return new AttributeListResource($attribute);
    }

    public function storeVariant(Request $request, Attribute $attribute)
    {
        $this->isTypeVariant($attribute);
        $request->validate([
           'value'=>'required|string',
        ]);

        DB::transaction(function () use ($request, &$attribute) {
            $attribute->variants()->create([
                'value'=>$request->value,
            ]);
        });

        return new AttributeListResource($attribute);
    }

    public function list(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string',
        ]);

        $query = Attribute::query();

        $query->orderBy('name')
            ->with('categories');

        //filters
        $query->when($request->search, function ($query, $search) {
            $query->where('name', 'like', '%' . $search . '%');
        });

        $data = $query->get();

        return AttributeListResource::collection($data);
    }

    public function show(Attribute $attribute)
    {

        return new AttributeListResource($attribute);
    }

    protected function isTypeVariant(Attribute $attribute)
    {

        if ($attribute->type != AttributeTypeEnum::SELECT->value) {
            throw ValidationException::withMessages( ['type' => 'Не подходящий тип характеристики!']);
        }
    }
}
