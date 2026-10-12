<?php

namespace App\Models;

use App\DTO\CalculatePriceInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class FurnitureAddonPivot extends Model implements CalculatePriceInterface
{
    use SoftDeletes;

    protected $table = 'furniture_addon';

    protected $fillable = [
        'furniture_id',
        'furniture_type',
        'addon_data_id',
        'addon_data_type',
    ];

    public function addon_data()
    {
        return $this->morphTo('addon_data');
    }

    public function calculatePrice()
    {
        return $this->addon_data?->calculatePrice();
    }
}
