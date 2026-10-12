<?php

namespace App\Models;

use App\Services\FurnitureService\FurnitureAddon\FurnitureAddons\Backlight;
use App\Traits\FurnitureHasRequestTrait;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;

class Mirror extends Model
{
    use SoftDeletes, FurnitureHasRequestTrait;

    protected $fillable = [
        'mirror_form_id',
        'mirror_backlight_id',
        'mirror_frame_id',
        'length',
        'height',
    ];

    public function form()
    {
        return $this->belongsTo(MirrorForm::class,'mirror_form_id');
    }

    public function frame()
    {
        return $this->belongsTo(MirrorFrame::class,'mirror_frame_id');
    }
    public function backlight()
    {
        return $this->belongsTo(Backlight::class,'mirror_backlight_id');
    }

    public function calculatePrice()
    {
        $total = 0;
        $price = MirrorPrice::where('mirror_form_id',$this->mirror_form_id)->where('mirror_backlight_id',$this->mirror_backlight_id)->first()
            ?? throw ValidationException::withMessages([
                'facade_id' => ['Выберите другой материал фасада.'],
            ]);


        $total += ($price->price * $this->length * $this->height) + $price->price_add;

        if ($this->mirror_frame_id){
            $framePrice = $this->frame?->price ?? 0;


            $total += $framePrice * $this->length * $this->height;
        }

        return  $total;
    }
}
