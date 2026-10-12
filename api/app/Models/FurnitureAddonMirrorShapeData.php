<?php

namespace App\Models;

use App\DTO\CalculatePriceInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureAddonMirrorShapeData extends Model implements CalculatePriceInterface
{
    use SoftDeletes;

    protected $fillable = [
        'furniture_addon_id',
        'count',
    ];

    public function furniture_addon()
    {
        return $this->belongsTo(FurnitureAddon::class);
    }

    public function calculatePrice()
    {
        return   ($this->furniture_addon?->price ?? 0) * $this->count;
    }
}

