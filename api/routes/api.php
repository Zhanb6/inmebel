<?php

use App\Http\Controllers\API\General\AuthController;
use App\Http\Controllers\API\General\CategoryController;
use App\Http\Controllers\API\General\FurnitureTypeController;
use App\Http\Controllers\API\General\ProductController;
use App\Http\Controllers\API\General\RequestController;
use App\Http\Controllers\API\General\WorkshopController;
use App\Http\Controllers\Attribute\AttributeController;
use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::post('/login',[AuthController::class,'login']);
Route::post('refresh-token', [AuthController::class, 'refresh_token']);
Route::post('/logout',[AuthController::class,'logout']);
Route::post('/workshops/register',[AuthController::class,'registerWorkshop']);
Route::post('/sellers/register',[AuthController::class,'registerSeller']);
Route::post('/clients/register',[AuthController::class,'registerClient']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('/me',[AuthController::class,'me']);
});

Route::prefix('/products')->group(function () {
   Route::get('/',[ProductController::class,'index'])->middleware('auth.optional');
   Route::get('/{product}',[ProductController::class,'show'])->middleware('auth.optional');
});

Route::prefix('/workshops')->group(function () {
   Route::get('/',[WorkshopController::class,'index']);
   Route::get('/list',[WorkshopController::class,'index']);
   Route::get('/{workshop}',[WorkshopController::class,'show']);
});

Route::prefix('/requests')->group(function () {
    Route::post('/getPrice',[RequestController::class,'getPrice']);
    Route::get('/console_tabletops/list',[RequestController::class,'consoleTableTabletopList']);
    Route::get('/mirror_frames/list',[RequestController::class,'mirrorFramesList']);
    Route::get('/mirror_backlights/list',[RequestController::class,'mirrorBacklightsList']);

    Route::get('/mirror_forms/list',[RequestController::class,'mirrorFormsList']);
    Route::get('/brands/list',[RequestController::class,'brandsList']);
    Route::get('/facades/list',[RequestController::class,'facadesList']);
    Route::get('/frames/list',[RequestController::class,'framesList']);
    Route::get('/kitchenTabletops/list',[RequestController::class,'kitchenTabletopList']);
    Route::get('/filling/list',[RequestController::class,'fillingList']);
    Route::get('/addons/list',[RequestController::class,'addonsList']);
    Route::get('/furnitureTypes/list',[RequestController::class,'furnitureTypesList']);
    Route::get('/furnitureSubtypes/list',[RequestController::class,'furnitureSubtypesList']);
    Route::get('/addons/dataTypes/list',[RequestController::class,'addonsDataTypesList']);
});

Route::get('/categories/list',[CategoryController::class,'categoriesList']);
Route::get('/attributes/list',[AttributeController::class,'list']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/media/{uuid}/download',[\App\Http\Controllers\API\General\MediaController::class,'downloadMedia'])->name('general.media.download');
    Route::get('/media/{uuid}/signatures/download',[\App\Http\Controllers\API\General\MediaController::class,'downloadSignature'])->name('general.media.signature.download');
});

Route::get('/furniture_types/list',[FurnitureTypeController::class,'list']);

Route::get('/furniture_usage',function(){
    $path = public_path('furniture_usage.pdf');
    return response()->file($path);
});
