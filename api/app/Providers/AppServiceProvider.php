<?php

namespace App\Providers;

use App\Services\SmsService\SmscService\SmscService;
use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(SmsServiceInterface::class, SmscService::class);
        Schema::defaultTimePrecision(6);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
