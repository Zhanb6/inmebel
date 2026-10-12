<?php

namespace App\Http\Requests\Auth;

use App\Rules\PhoneRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterClientRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'phone'=> ['required','string','unique:users,phone', new PhoneRule()],
            'password'=>'required|string|confirmed',
            'iin'=>'required|string',
            'address'=>'nullable|string',
            'images'=>'nullable|array',
            'images.*'=>'required|image|mimes:jpeg,png,jpg,svg|max:4048',
        ];
    }
}
