<?php

namespace App\Http\Controllers\API\General;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterClientRequest;
use App\Http\Requests\Auth\RegisterWokshopRequest;
use App\Http\Resources\User\TokenResource;
use App\Http\Resources\User\UserResource;
use App\Http\Resources\User\UserShowResource;
use App\Models\User;
use App\Rules\PhoneRule;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService)
    {

    }


    public function login(Request $request)
    {

        $credentials = $request->validate([
            'phone'    => ['required',new PhoneRule()],
            'password' => 'required',
        ]);

        $user = User::where('phone', $credentials['phone'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['Неверные учетные данные.'],
            ]);
        }

        if ($user->hasRole(RoleEnum::WORKSHOP->value) && !$user->workshop?->accepted_at){
            throw ValidationException::withMessages([
                'user' => ['Ваш цех находиться на модерации.'],
            ]);
        }

        $tokens = $this->authService->generateTokens($user);

        return $this->sendResponseWithTokens($tokens,[
            'user'  => new UserResource($user),
            'role'=>$user->roles()->first()?->name,
        ]);
    }

    public function logout(Request $request)
    {
        $refresh_token = $this->getRefreshToken($request);
        $this->authService->logout($refresh_token);

        return response()->json([
            'message' => 'Вы вышли из системы',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user'=>new UserShowResource($request->user()),
            'role'=>$request->user()?->roles()->first()?->name,
        ]);
    }


    private function sendResponseWithTokens(array $tokens, $body = [])
    {
        $rtExpireTime = config('sanctum.refresh_token_expiration');
        $cookie = cookie('refresh_token', $tokens['refresh_token']->plainTextToken, $rtExpireTime, secure: true);

        $tokensInfo = new TokenResource($tokens['access_token']);

        $data = array_merge($body, [
            'access_token' => $tokensInfo->jsonSerialize()
        ]);

        return response()->json($data)->withCookie($cookie);
    }

    public function refresh_token(Request $request)
    {

        $refresh_token = $this->getRefreshToken($request);

        Log::info('Refresh token is - '.$request->cookie('refresh_token'));

        $tokens = $this->authService->refresh_token($refresh_token);
//        $tokens = $this->authService->generateTokens(User::find(2));

        return $this->sendResponseWithTokens($tokens);
    }

    protected function getRefreshToken(Request $request)
    {
        $refresh_token = $request->cookie('refresh_token');

        if (!$refresh_token) {
            return response()->json(['message' => 'Нет refresh token'], 401);
        }

        return $refresh_token;
    }

    public function registerWorkshop(RegisterWokshopRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
            ]);

            $workshop = $user->workshops()->create([
                'name'=>$request->workshop_name,
                'iin'=>$request->iin,
                'address'=>$request->address,
                'bik'=>$request->workshop_bik,
                'bank'=>$request->workshop_bank,
                'director_name'=>$request->workshop_director_name,
                'iic'=>$request->workshop_iic,
                'bc'=>$request->workshop_bc,
                'city'=>$request->workshop_city,
            ]);

            if ($request->images){
                foreach ($request->images as $image){
                    $workshop
                        ->addMedia($image)
                        ->toMediaCollection();
                }
            }

            $user->assignRole(RoleEnum::WORKSHOP->value);
        });

        return response_success();
    }


    public function registerSeller(RegisterWokshopRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
            ]);

            $sellerData = $user->seller_data()->create([
                'name'=>$request->workshop_name,
                'iin'=>$request->iin,
                'address'=>$request->address,
            ]);

            if ($request->images){
                foreach ($request->images as $image){
                    $sellerData
                        ->addMedia($image)
                        ->toMediaCollection();
                }
            }

            $user->assignRole(RoleEnum::SELLER->value);
        });

        return response_success();
    }


    public function registerClient(RegisterClientRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
            ]);

            $sellerData = $user->client_data()->create([
                'iin'=>$request->iin,
                'address'=>$request->address,
            ]);

            if ($request->images){
                foreach ($request->images as $image){
                    $sellerData
                        ->addMedia($image)
                        ->toMediaCollection();
                }
            }

            $user->assignRole(RoleEnum::CLIENT->value);
        });

        return response_success();
    }


}
