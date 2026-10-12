<?php

namespace App\Http\Requests\RequestModel;

use Illuminate\Foundation\Http\FormRequest;

class RequestModelClientStoreRequest extends FormRequest
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
        return [
            'workshop_id'=>'required|integer|exists:App\Models\Workshop,id',
            'furniture_type_id'=>'required|integer|exists:App\Models\FurnitureType,id',
//            'address'=>'nullable|string',
            'description'=>'nullable|string',

//            'client_name'=>'required|string',
//            'client_iin'=>'required|string',
//            'client_phone'=>'required|string',
//            'client_address'=>'required|string',
        ];
    }
}
