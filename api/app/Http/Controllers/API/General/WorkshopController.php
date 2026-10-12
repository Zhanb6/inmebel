<?php

namespace App\Http\Controllers\API\General;

use App\Enums\PaginationMetaEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Workshop\WorkshopGeneralIndexResource;
use App\Http\Resources\Workshop\WorkshopGeneralShowResource;
use App\Models\Workshop;
use Illuminate\Http\Request;

class WorkshopController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string',
            'perPage' => 'nullable|integer',
        ]);

        $query = Workshop::query();

        $query->latest();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return WorkshopGeneralIndexResource::collection($data);
    }

    public function show(Workshop $workshop)
    {

        return new WorkshopGeneralShowResource($workshop);
    }
}
