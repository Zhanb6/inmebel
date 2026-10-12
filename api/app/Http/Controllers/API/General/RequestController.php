<?php

namespace App\Http\Controllers\API\General;

use App\Enums\FurnitureAddonDataTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Facade\FacadeListResource;
use App\Http\Resources\FurnitureSubtype\FurnitureSubtypeListResource;
use App\Http\Resources\FurnitureType\FurnitureTypeListResource;
use App\Http\Resources\General\IdNameResource;
use App\Http\Resources\KitchenTabletop\KitchenTabletopListResource;
use App\Models\Brand;
use App\Models\ConsoleTabletop;
use App\Models\Facade;
use App\Models\Filling;
use App\Models\Frame;
use App\Models\FurnitureAddon;
use App\Models\FurnitureSubtype;
use App\Models\FurnitureType;
use App\Models\KitchenTabletop;
use App\Models\MirrorBacklight;
use App\Models\MirrorForm;
use App\Models\MirrorFrame;
use App\Services\FurnitureService\Furniture\FurnitureFactory;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function getPrice(Request $request)
    {

        $request->validate([
            'furniture_type_id'=>'required|integer|exists:App\Models\FurnitureType,id',
            'address'=>'nullable|string',
            'description'=>'nullable|string',
        ]);


        $furnitureLocal = FurnitureFactory::make($request->furniture_type_id)->localMode()->setData($request->all());
//        $data['price'] = $furnitureLocal->calculatePrice();
        $data['price_from'] = $furnitureLocal->calculatePriceFrom();
        $data['price_to'] = $furnitureLocal->calculatePriceTo();
        $data['price'] = $furnitureLocal->calculatePrice();



        return response()->json(['data' => $data]);
    }

    public function addonTypes()
    {
        return FurnitureAddonDataTypeEnum::list();
    }

    public function brandsList()
    {
        return response()->json([
            'data'=>Brand::select('id','name')->orderBy('name')->get()
        ]);
    }

    public function mirrorFramesList()
    {
        return response()->json([
            'data'=>MirrorFrame::select('id','name')->get()
        ]);
    }
    public function mirrorBacklightsList()
    {
        return response()->json([
            'data'=>MirrorBacklight::select('id','name')->get()
        ]);
    }
    public function mirrorFormsList()
    {
        return response()->json([
            'data'=>MirrorForm::select('id','name')->get()
        ]);
    }

    public function consoleTableTabletopList(Request $request)
    {
        $data = ConsoleTabletop::with('sinks')->get()->map(function ($item) {
            $newItem['id']=$item->id;
            $newItem['name']=$item->name;
            $newItem['sinks']= IdNameResource::collection($item->sinks);

            return $newItem;
        });
        return response()->json([
            'data'=>$data
        ]);
    }

    public function facadesList(Request $request)
    {
        $request->validate([
            'furniture_type_id' => 'nullable|integer|exists:App\Models\FurnitureType,id',
        ]);
        $facades = Facade::select('id','name')->with('types.media','colors.media')
            ->orderBy('name')
            ->when($request->furniture_type_id,function ($query,$data){
                $query->whereHas('furniture_types',function ($query) use ($data){
                    $query->where('furniture_types.id',$data);
                });
            })
            ->get();
        return  FacadeListResource::collection($facades);
    }

    public function framesList()
    {
        return response()->json([
            'data'=>Frame::select('id','name')->orderBy('name')->get()
        ]);
    }

    public function fillingList()
    {
        return response()->json([
            'data'=>Filling::select('id','name')->orderBy('name')->get()
        ]);
    }

    public function addonsList()
    {
        return response()->json([
            'data'=>FurnitureAddon::select('id','name','data_type')->get()
        ]);
    }

    public function addonsDataTypesList()
    {
        return response()->json([
            'data'=>FurnitureAddonDataTypeEnum::list()
        ]);
    }

    public function furnitureTypesList()
    {

        $data = FurnitureType::select('id','name')->with('subtypes.media','brands','addons')->get();
        return FurnitureTypeListResource::collection($data);

    }

    public function furnitureSubtypesList()
    {
        $data = FurnitureSubtype::with('media')->get();
        return FurnitureSubtypeListResource::collection($data);
    }

    public function kitchenTabletopList()
    {
        $data = KitchenTabletop::all();

        return KitchenTabletopListResource::collection($data);
    }
}
