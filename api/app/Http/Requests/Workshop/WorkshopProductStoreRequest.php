<?php

namespace App\Http\Requests\Workshop;

use App\Services\AttributeService\Types\AttributeService;
use Illuminate\Foundation\Http\FormRequest;

class WorkshopProductStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $basicRule = [
            'images'=>'required|array|min:1',
            'images.*'=>'required|image|mimes:jpeg,png,jpg|max:4048',
            'name'=>'required|string',
            'price'=>'required|integer',
            'description'=>'nullable|string',

            'categories'=>'required|array|min:1',
            'categories.*'=>'required|integer|exists:App\Models\Category,id',

            'attributes'=>'nullable|array|min:1',
            'attributes.*.id'=>'required|integer|exists:App\Models\Attribute,id',
        ];
        $attributeRule = AttributeService::getFullRules($this->request->all());


        return array_merge($basicRule, $attributeRule);
    }


}
