<?php

use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Admin\UserController;
use App\Http\Controllers\API\General\AuthController;
use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard',[DashboardController::class,'index']);

Route::prefix('users')->group(function(){
    Route::get('/',[UserController::class,'index']);
    Route::get('/{user}',[UserController::class,'show']);
    Route::get('/{user}/orders',[UserController::class,'orders']);
    Route::get('/{user}/requests',[UserController::class,'requests']);
    Route::get('/{user}/products/liked',[UserController::class,'productsLiked']);
    Route::get('/{user}/products',[UserController::class,'products']);
    Route::get('/{user}/cart',[UserController::class,'cart']);
    Route::post('/{user}/accept/workshop',[UserController::class,'acceptWorkshop']);
    Route::post('/{user}/workshop/update',[UserController::class,'workshopUpdate']);
    Route::post('/{user}/client_data/update',[UserController::class,'clientDataUpdate']);
    Route::post('/{user}/update',[UserController::class,'update']);
    Route::post('/{user}/accept/workshop',[UserController::class,'acceptWorkshop']);
//    Route::post('/{user}/accept/seller',[UserController::class,'acceptSeller']);
});


Route::prefix('requests')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Admin\RequestController::class,'index']);
    Route::get('/{requestModel}',[\App\Http\Controllers\API\Admin\RequestController::class,'show']);
    Route::post('/{requestModel}/to_prev_status',[\App\Http\Controllers\API\Admin\RequestController::class,'prevStatusUpdate']);
});


Route::prefix('orders')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Admin\OrderController::class,'index']);
    Route::get('/{order}',[\App\Http\Controllers\API\Admin\OrderController::class,'show']);
    Route::post('/{order}/to_prev_status',[\App\Http\Controllers\API\Admin\OrderController::class,'prevStatusUpdate']);
});


Route::prefix('products')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Admin\ProductController::class,'index']);
    Route::get('/{product}',[\App\Http\Controllers\API\Admin\ProductController::class,'show']);
});

Route::prefix('categories')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Admin\CategoryController::class,'index']);
    Route::post('/',[\App\Http\Controllers\API\Admin\CategoryController::class,'store']);
    Route::put('/{category}',[\App\Http\Controllers\API\Admin\CategoryController::class,'update']);
    Route::delete('/{category}',[\App\Http\Controllers\API\Admin\CategoryController::class,'destroy']);
    Route::get('/{category}',[\App\Http\Controllers\API\Admin\CategoryController::class,'show']);
    Route::put('/{category}/attributes/{attribute}',[\App\Http\Controllers\API\Admin\CategoryController::class,'attachAttribute']);
});

Route::prefix('attributes')->group(function(){
    Route::get('/',[\App\Http\Controllers\API\Admin\AttributeController::class,'index']);
    Route::post('/',[\App\Http\Controllers\API\Admin\AttributeController::class,'store']);
    Route::get('/list',[\App\Http\Controllers\API\Admin\AttributeController::class,'list']);
    Route::get('/{attribute}',[\App\Http\Controllers\API\Admin\AttributeController::class,'show']);
    Route::put('/{attribute}',[\App\Http\Controllers\API\Admin\AttributeController::class,'update']);
    Route::delete('/{attribute}',[\App\Http\Controllers\API\Admin\AttributeController::class,'destroy']);
    Route::post('/{attribute}/variants',[\App\Http\Controllers\API\Admin\AttributeController::class,'storeVariant']);
    Route::put('/{attribute}/variants/{attributeVariant}',[\App\Http\Controllers\API\Admin\AttributeController::class,'updateVariant']);
    Route::delete('/{attribute}/variants/{attributeVariant}',[\App\Http\Controllers\API\Admin\AttributeController::class,'destroyVariant']);
});
