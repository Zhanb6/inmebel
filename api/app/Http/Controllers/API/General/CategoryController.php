<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller;
use App\Http\Resources\Category\CategoryListResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function categoriesList()
    {
        $categories = Category::orderBy('name')->get();
        return CategoryListResource::collection($categories);
    }
}
