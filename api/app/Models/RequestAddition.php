<?php

namespace App\Models;

use App\Enums\OrderStatusEnum;
use App\Enums\RequestAdditionStatusEnum;
use App\Enums\RequestStatusEnum;
use App\Observers\RequestAdditionObserver;
use App\Services\FurnitureService\FurnitureStatus\FurnitureStatusFactory;
use App\Services\OrderService\OrderStatusService\OrderStatusService;
use App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatusFactory;
use App\Services\RequestAdditionService\RequestAdditionStatusService\RequestAdditionStatusService;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([RequestAdditionObserver::class])]
class RequestAddition extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'request_id',
        'request_addition_status_id',
        'furniture_type_id',
        'furniture_data_type',
        'furniture_data_id',
        'price',
        'description',
        'number',
    ];

    public function request_model()
    {
        return $this->belongsTo(RequestModel::class,'request_id');
    }


    public function furniture_type()
    {
        return $this->belongsTo(FurnitureType::class, 'furniture_type_id');
    }

    public function furniture_data()
    {
        return $this->morphTo('furniture_data');
    }

    public function scopeFinished($query)
    {
        $query->where('request_addition_status_id'.RequestAdditionStatusEnum::FINISHED->value);
    }

    public function request_addition_status()
    {
        return $this->belongsTo(RequestAdditionStatus::class, 'request_addition_status_id');
    }



    public function histories()
    {
        return $this->hasMany(RequestAdditionStatusHistory::class,  'request_addition_id','id');
    }

    public function getNextStatusId()
    {
        return $this->getNextStatusEnum()->value;
    }


    public function getNextStatusEnum(): ?RequestAdditionStatusEnum
    {
        return RequestAdditionStatusService::nextStatus($this);
    }

    public function getCurrentStatusEnum(): ?RequestAdditionStatusEnum
    {
        return RequestAdditionStatusService::tryFrom($this->request_addition_status_id);
    }

    public function getPrevStatusEnum(): ?RequestAdditionStatusEnum
    {
        return RequestAdditionStatusService::prevStatus($this);
    }
}
