<?php

namespace App\Traits;

use App\Models\Review;

trait HasReviewTrait
{
    public function reviews()
    {
        return $this->morphMany(Review::class, 'model');
    }

    public function reviews_with_comment()
    {
        return $this->morphMany(Review::class, 'model')->whereNotNull('comment');
    }
}
