<?php

namespace App\Traits;

use App\Models\ModelHasLike;
use Illuminate\Support\Facades\Auth;

trait HasLikeTrait
{
    public function likes()
    {
        return $this->morphMany(ModelHasLike::class, 'model');
    }

    public function auth_user_like()
    {

        return $this->morphOne(ModelHasLike::class, 'model')->withAttributes(['user_id' => Auth::user()?->id]);
    }
}
