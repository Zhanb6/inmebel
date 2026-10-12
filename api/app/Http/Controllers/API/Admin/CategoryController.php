<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Category\CategoryAdminShowResource;
use App\Http\Resources\Category\CategoryListResource;
use App\Models\Attribute;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string',
        ]);

        $query = Category::query();

        $query->orderBy('name');

        //filters
        $query->when($request->search, function ($query, $search) {
           $query->where('name', 'like', '%' . $search . '%');
            $query->orWhere('id','ilike','%'.$search.'%');
        });

        $count = $query->clone()->count();
        $data = $query->get();

        return CategoryListResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function show(Category $category)
    {

        return new CategoryAdminShowResource($category);
    }

    public function attachAttribute(Request $request, Category $category,Attribute $attribute)
    {

        if ($category->attributes()->where('attributes.id',$attribute->id)->exists()) {
            throw ValidationException::withMessages([
                'attributeId' => 'Характеристика уже подключен к категории',
            ]);
        }
        $category->attributes()->attach($attribute->id);

        return response_success();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'parent_category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $data = Category::create($validated);

        return new CategoryAdminShowResource($data);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'parent_category_id' => 'present|nullable|integer|exists:categories,id',
        ]);

        $category->update($validated);

        return new CategoryAdminShowResource($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response_success();
    }

}
