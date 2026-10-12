<?php

use App\Http\Controllers\API\Admin\UserController;
use App\Http\Controllers\API\General\AuthController;
use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/info',[\App\Http\Controllers\API\Workshop\WorkshopController::class,'info']);
Route::post('/info',[\App\Http\Controllers\API\Workshop\WorkshopController::class,'infoUpdate']);


Route::prefix('products')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Workshop\WorkshopProductController::class,'index']);
    Route::post('/',[\App\Http\Controllers\API\Workshop\WorkshopProductController::class,'store']);
    Route::get('/{product}',[\App\Http\Controllers\API\Workshop\WorkshopProductController::class,'show']);
    Route::delete('/{product}',[\App\Http\Controllers\API\Workshop\WorkshopProductController::class,'destroy']);
    Route::post('/{product}',[\App\Http\Controllers\API\Workshop\WorkshopProductController::class,'update']);
    Route::delete('/{product}/media/{id}',[\App\Http\Controllers\API\Workshop\WorkshopProductController::class,'destroyMedia']);
});

Route::prefix('requests')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Workshop\RequestController::class,'index']);
    Route::get('/{requestModel}',[\App\Http\Controllers\API\Workshop\RequestController::class,'show']);
    Route::post('/{requestModel}/additions/{requestAddition}/nextStatus',[\App\Http\Controllers\API\Workshop\RequestController::class,'requestAdditionNextStatusUpdate']);
    Route::post('/{requestModel}/nextStatus',[\App\Http\Controllers\API\Workshop\RequestController::class,'nextStatusUpdate']);
    Route::post('/{requestModel}/sendCodeToAcceptContract',[\App\Http\Controllers\API\Workshop\RequestController::class,'sendCodeToAcceptContract']);
});

Route::prefix('orders')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Workshop\OrderController::class,'index']);
    Route::get('/{order}',[\App\Http\Controllers\API\Workshop\OrderController::class,'show']);
    Route::post('/{order}/nextStatus',[\App\Http\Controllers\API\Workshop\OrderController::class,'nextStatusUpdate']);

});
