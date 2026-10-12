<?php

namespace App\Services;

use App\Enums\TokenAbilityEnum;
use App\Models\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function generateTokens($user): array
    {
        $atExpireTime = now()->addMinutes(config('sanctum.expiration'));
        $rtExpireTime = now()->addMinutes(config('sanctum.refresh_token_expiration'));

        $accessToken = $user->createToken('access_token', [TokenAbilityEnum::ACCESS_API->value], $atExpireTime);
        $refreshToken = $user->createToken('refresh_token', [TokenAbilityEnum::ISSUE_ACCESS_TOKEN->value], $rtExpireTime);

        $refreshToken->accessToken->update([
            'meta_data'=>[
                'access_token_id'=>$accessToken->accessToken?->id,
            ]
        ]);

        $accessToken->accessToken->update([
            'meta_data'=>[
                'refresh_token_id'=>$refreshToken->accessToken?->id,
            ]
        ]);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ];
    }

    public function refresh_token($refresh_token)
    {
        $user = $this->deleteTokensByRefreshToken($refresh_token);

        $tokens = $this->generateTokens($user);

        return $tokens;
    }

    public function logout($refresh_token)
    {

        $this->deleteTokensByRefreshToken($refresh_token);
        return true;
    }

    public function deleteTokensByRefreshToken($refresh_token)
    {
        if (!$refresh_token) {
            return throw ValidationException::withMessages( ['message' => 'Нет refresh token']);
        }

        $token = PersonalAccessToken::findToken($refresh_token);
        $user = $token?->tokenable;

        if (!$user) {
            return throw ValidationException::withMessages( ['message' => 'Пользователь не найден по refresh token']);
        }


        if (@$token?->meta_data['access_token_id']){
            $user->tokens()->find($token?->meta_data['access_token_id'])?->delete();
        }

        $token->delete();

        return $user;
    }
}
