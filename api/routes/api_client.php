<?php

use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Admin\UserController;
use App\Http\Controllers\API\Client\CartController;
use App\Http\Controllers\API\Client\OrderController;
use App\Http\Controllers\API\Client\ProductController;
use App\Http\Controllers\API\Client\RequestController;
use App\Http\Controllers\API\General\AuthController;
use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/info',[\App\Http\Controllers\API\Client\ClientDataController::class,'info']);
Route::post('/info',[\App\Http\Controllers\API\Client\ClientDataController::class,'infoUpdate']);

Route::prefix('requests')->group(function () {
    Route::get('/',[RequestController::class,'index']);
    Route::post('/',[RequestController::class,'store']);

    Route::get('/{requestModel}',[RequestController::class,'show']);
    Route::post('/{requestModel}/additions',[RequestController::class,'storeAdditions']);
    Route::post('/{requestModel}/additions/{requestAddition}/nextStatus',[RequestController::class,'requestAdditionNextStatusUpdate']);
//Route::put('/requests/{requestModel}/accept',[RequestController::class,'accept']);
    Route::post('/{requestModel}/nextStatus',[RequestController::class,'nextStatus']);
    Route::post('/{requestModel}/sendCodeToAcceptContract',[RequestController::class,'sendCodeToAcceptContract']);
});

Route::prefix('products')->group(function () {
    Route::get('/liked',[ProductController::class,'likedProducts']);
    Route::post('/{product}/review',[ProductController::class,'reviewStore']);
    Route::post('/{product}/like/toggle',[ProductController::class,'likeToggle']);
});

Route::prefix('/cart')->group(function () {
    Route::get('/',[CartController::class,'index']);
    Route::post('/add',[CartController::class,'add']);
    Route::put('/',[CartController::class,'update']);
    Route::delete('/items/clear',[CartController::class,'clear']);
    Route::delete('/items/{cartItem}',[CartController::class,'remove']);
    Route::get('/{cart}',[CartController::class,'show']);
    Route::delete('/{cart}',[CartController::class,'destroy']);
});

Route::prefix('/orders')->group(function () {
    Route::get('/',[OrderController::class,'index']);

    Route::get('/make',[OrderController::class,'make']);
    Route::get('/{order}',[OrderController::class,'show']);
});




