<?php

namespace App\Http\Controllers\Attribute;

use App\Http\Controllers\Controller;
use App\Http\Resources\Attribute\AttributeListResource;
use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    public function list(Request $request)
    {

        $request->validate([
            'category_ids'=>'nullable|integer|exists:App\Models\Category,id',
            'category_ids.*' => 'required|integer|exists:App\Models\Category,id',
        ]);
        $data = Attribute::orderBy('name')
            ->with('variants','categories')
            ->when($request->category_ids,function($query) use($request){
                $query->whereHas('categories',function($query) use($request){
                    $query->whereIn('categories.id',$request->category_ids);
                });
            })
            ->get();

        return AttributeListResource::collection($data);
    }
}
