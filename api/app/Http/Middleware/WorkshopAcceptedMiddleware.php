<?php

namespace App\Http\Middleware;

use App\Enums\RoleEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class WorkshopAcceptedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user->hasRole(RoleEnum::WORKSHOP->value) && !$user->workshop?->accepted_at){
            abort(Response::HTTP_UNAUTHORIZED,'Unauthorized (workshop not accepted)');
        }

        return $next($request);
    }
}
