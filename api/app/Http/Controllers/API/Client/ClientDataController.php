<?php

namespace App\Http\Controllers\API\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserClientInfoShowResource;
use App\Http\Resources\Workshop\WorkshopWorkshopShowResource;
use App\Models\UserClientData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientDataController extends Controller
{
    public function info()
    {
        return new UserClientInfoShowResource(Auth::user()->client_data);
    }

    public function infoUpdate(Request $request)
    {
        $request->validate([
            'iin'=>'required|string',
            'address'=>'required|string',
        ]);
        UserClientData::updateOrCreate([
            'user_id' => Auth::user()->id,
        ],$request->all());


        return new UserClientInfoShowResource(Auth::user()->client_data->fresh());
    }
}
