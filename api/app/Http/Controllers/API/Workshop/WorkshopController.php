<?php

namespace App\Http\Controllers\API\Workshop;

use App\Http\Controllers\Controller;
use App\Http\Resources\Workshop\WorkshopWorkshopShowResource;
use Illuminate\Http\Request;

class WorkshopController extends WorkshopBaseController
{
    public function info()
    {
        return new WorkshopWorkshopShowResource($this->workshop);
    }

    public function infoUpdate(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'iin' => 'required',
            'address' => 'required|string',
            'images'=>'nullable|array|min:1',
            'images.*'=>'required|image|mimes:jpeg,png,jpg|max:4048',
            'description'=>'nullable|string',
            'bic'=>'required|string',
            'bank'=>'required|string',
            'director_name'=>'required|string',
            'iic'=>'required|string',
            'bc'=>'required|integer|digits:2',
            'city'=>'required|string',
        ]);

       $this->workshop->update($request->all());

        if ($request->images){
            $this->workshop->clearMediaCollection();
            foreach ($request->images as $image){
                $this->workshop
                    ->addMedia($image)
                    ->toMediaCollection();
            }
        }

        return new WorkshopWorkshopShowResource($this->workshop->fresh());
    }
}
