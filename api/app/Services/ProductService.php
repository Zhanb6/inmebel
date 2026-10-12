<?php

namespace App\Services;

use App\Services\AttributeService\Types\AttributeService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

class ProductService
{
    public static function filterQuery($query,$filters = []){

        $rules = [
            'search'=>'nullable|string',
            'category_ids'=>'nullable|array|min:1',
            'category_ids.*'=>'required|integer|exists:App\Models\Category,id',
            'attributes'=>'nullable|array|min:1',
            'attributes.*.id'=>'required|integer|exists:App\Models\Attribute,id',
        ];
        Validator::make($filters,$rules)->validate();
        $attributeRule = AttributeService::getFullRules($filters);

        $rules = array_merge($rules, $attributeRule);

        Validator::make($filters,$rules)->validate();

        $query->when(@$filters['search'], function ($query, $data) {
            $query->where('name', 'ilike', '%' . $data . '%');
        });

        $query->when(@$filters['category_ids'], function ($query, $data) {
            $query->whereHas('categories', function ($query) use ($data) {
                $query->whereIn('categories.id', @$data);
            });
        });

        $query->when(@$filters['attributes'], function ($query, $data) {
            $query->whereHas('attributes', function ($query) use ($data) {
                $query->where(function ($query) use ($data) {
                    foreach ($data as $key => $value) {
                        $query->where('product_attributes.attribute_id', $value['id']);

                        if (@$value['value']){
                            $query->where('product_attributes.value', $value['value']);
                        }

                        if (@$value['attribute_variant_ids']){
                            $query->whereHas('variants',function ($query) use ($value){
                                $query->whereIn('product_attribute_variant.attribute_variant_id', $value['attribute_variant_ids']);
                            });


                        }
                    }
                });
                $query->whereIn('product_attributes.attribute_id', Arr::pluck(@$data ?? [],'id'));
            });
        });

        return $query;
    }


}
