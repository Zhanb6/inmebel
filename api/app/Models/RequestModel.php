<?php

namespace App\Models;

use App\Enums\RequestStatusEnum;
use App\Observers\RequestModelObserver;
use App\Services\FurnitureService\FurnitureStatus\FurnitureStatusFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[ObservedBy([RequestModelObserver::class])]
class RequestModel extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $table = 'requests';

    protected $fillable = [
        'request_status_id',
        'furniture_type_id',
        'furniture_data_type',
        'furniture_data_id',
        'user_id',
        'workshop_id',

        'price',

        'description',
        'price_from',
        'price_to',

        'client_name',
        'client_iin',
        'client_phone',
        'client_address',

        'request_contract_date',
    ];

    protected $casts = [
        'request_contract_date'=>'date'
    ];

    public function furniture_type()
    {
        return $this->belongsTo(FurnitureType::class, 'furniture_type_id');
    }

    public function furniture_data()
    {
        return $this->morphTo('furniture_data');
    }

    public function request_status()
    {
        return $this->belongsTo(RequestStatus::class, 'request_status_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function histories()
    {
        return $this->hasMany(RequestStatusHistory::class,  'request_id','id');
    }

    public function getNextStatusId()
    {
        return $this->getNextStatusEnum()->value;
    }

    public function workshop()
    {
        return $this->belongsTo(Workshop::class);
    }

    public function request_additions()
    {
        return $this->hasMany(RequestAddition::class, 'request_id');
    }

    public function last_accepted_request_additions()
    {
        return $this->hasOne(RequestAddition::class, 'request_id')->latestOfMany()->finished();
    }

    public function scopeFilter($query,$data)
    {
        $query->when(@$data['search'],function ($query) use ($data){
            $query->where(function ($query) use ($data){
                $query->where('client_name','like','%'.$data['search'].'%');
                $query->orWhere('client_iin','like','%'.$data['search'].'%');
                $query->orWhere('client_phone','like','%'.$data['search'].'%');
                $query->orWhere('client_address','like','%'.$data['search'].'%');

                $query->orWhereHas('workshop',function ($query) use ($data){
                    $query->filter($data);
                });

                $query->orWhere('id','ilike','%'.$data['search'].'%');
            });

        });
    }

    public function getNextStatusEnum(): ?RequestStatusEnum
    {
        return FurnitureStatusFactory::make($this->furniture_type_id)->setCurrentStatus(RequestStatusEnum::tryFrom($this->request_status_id))->nextStatus();
    }

    public function getPrevStatusEnum(): ?RequestStatusEnum
    {
        return FurnitureStatusFactory::make($this->furniture_type_id)->setCurrentStatus(RequestStatusEnum::tryFrom($this->request_status_id))->prevStatus();
    }

    public function getCurrentStatusEnum(): ?RequestStatusEnum
    {
        return RequestStatusEnum::tryFrom($this->request_status_id);
    }
}
