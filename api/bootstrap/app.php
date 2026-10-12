<?php

use App\Http\Middleware\ForceJsonResponse;
use App\Http\Middleware\WorkshopAcceptedMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::prefix('api/admin')
                ->middleware(['api','auth:sanctum','role:'.\App\Enums\RoleEnum::ADMIN->value])
                ->group(base_path('routes/api_admin.php'));

            Route::prefix('api/workshop')
                ->middleware(['api','auth:sanctum','role:'.\App\Enums\RoleEnum::WORKSHOP->value,WorkshopAcceptedMiddleware::class])
                ->group(base_path('routes/api_workshop.php'));

            Route::prefix('api/client')
                ->middleware(['api','auth:sanctum','role:'.\App\Enums\RoleEnum::CLIENT->value])
                ->group(base_path('routes/api_client.php'));

        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(HandleCors::class);


        $middleware->api(append: [
            ForceJsonResponse::Class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
//            'permission' => App\Http\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'auth.optional' => \App\Http\Middleware\AuthOptionalMiddleware::class,
//            'abilities' => CheckAbilities::class,
//            'ability' => CheckForAnyAbility::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
