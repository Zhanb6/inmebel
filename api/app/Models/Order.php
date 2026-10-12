<?php

namespace App\Models;

use App\Enums\OrderStatusEnum;
use App\Observers\OrderObserver;
use App\Services\OrderService\OrderService;
use App\Services\OrderService\OrderStatusService\OrderStatusService;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([OrderObserver::class])]
class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'workshop_id',
        'user_id',
        'order_status_id',
        'price',
    ];

    public function histories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class,'order_product')->withPivot(['price','quantity']);
    }

    public function workshop()
    {
        return $this->belongsTo(Workshop::class,'workshop_id');
    }

    public function status()
    {
        return $this->belongsTo(OrderStatus::class,'order_status_id');
    }

    public function scopeFilter($query,$data)
    {
        $query->when(@$data['search'], function ($query) use ($data) {
            $query->whereHas('workshop', function ($query) use ($data) {
                $query->filter($data);
            });
            $query->orWhere('id','ilike','%'.$data['search'].'%');

        });
    }

    public function getNextStatusEnum(): ?OrderStatusEnum
    {
        return OrderStatusService::nextStatus($this);
    }

    public function getCurrentStatusEnum(): ?OrderStatusEnum
    {
        return OrderStatusEnum::tryFrom($this->order_status_id);
    }

    public function getPrevStatusEnum(): ?OrderStatusEnum
    {
        return OrderStatusService::prevStatus($this);
    }
}
