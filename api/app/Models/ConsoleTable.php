<?php

namespace App\Models;

use App\Traits\HasAddonsTrait;
use App\Traits\HasFillingTrait;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;

class ConsoleTable extends Model
{
    use SoftDeletes, HasAddonsTrait, HasFillingTrait;

    protected $fillable = [
//        'furniture_subtype_id',
        'frame_id',
        'facade_id',
        'facade_type_id',
        'facade_color_id',
        'brand_id',
        'length',
        'height',
        'furniture_subtype_data_id',
        'furniture_subtype_data_type',
        'console_tabletop_id',
        'console_sink_id',
    ];

    public function type()
    {
        return $this->belongsTo(FurnitureSubtype::class);
    }

    public function furniture_type()
    {
        return $this->hasOneThrough(FurnitureType::class, FurnitureSubtype::class,'id','id', 'furniture_subtype_id','furniture_type_id');
    }

    public function frame()
    {
        return $this->belongsTo(Frame::class);
    }
    public function facade()
    {
        return $this->belongsTo(Facade::class);
    }

    public function facade_type()
    {
        return $this->belongsTo(FacadeType::class);
    }

    public function facade_color()
    {
        return $this->belongsTo(FacadeColor::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function subtype_data()
    {
        return $this->morphTo('furniture_subtype_data');
    }


    public function tabletop()
    {
        return $this->belongsTo(ConsoleTabletop::class,'console_tabletop_id');
    }

    public function sink()
    {
        return $this->belongsTo(ConsoleSink::class,'console_sink_id');
    }

    public function calculatePrice()
    {
        $sizeMultiplication = 2;
        $total = 0;

        $price = $this->furniture_type?->prices()->where('facade_id',$this->facade_id)->where('frame_id',$this->frame_id)->first()?->price
            ?? throw ValidationException::withMessages([
                'facade_id' => ['Выберите другой материал фасада.'],
            ]);

        $total += $this->length * $this->height * ($price ?? 0) * $sizeMultiplication;


        if ($this->console_tabletop_id){
            $total += $this->length * $this->tabletop?->price;
        }

        if ($this->console_tabletop_id && $this->console_sink_id){
            $getSinkPrice = $this->tabletop?->sinks()->where('console_tabletop_sink.id' ,$this->console_sink_id)?->first()?->pivot?->price ??
                throw ValidationException::withMessages([
                    'facade_id' => ['Выберите другой материал фасада.'],
                ]);
            $total += $getSinkPrice;
        }

        if ($this->brand){
            $percentage = $this->furniture_type->brands()->where('brands.id',$this->brand?->id)?->firstOrFail()?->pivot?->percentage
                ?? throw new Exception('Бренд не найден');

            $total = $total * ((100 + ($percentage ?? 0))/100);

        }

        if ($this->addons?->count()){
            foreach ($this->addons as $addon){
                $total += $addon->calculatePrice();
            }
        }

        return $total;
    }
}
