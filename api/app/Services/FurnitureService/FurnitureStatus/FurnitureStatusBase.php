<?php

namespace App\Services\FurnitureService\FurnitureStatus;


use App\Enums\RequestStatusEnum;
use App\Http\Resources\Media\MediaResource;
use App\Models\FurnitureType;
use App\Models\RequestModel;
use App\Models\RequestStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

abstract class FurnitureStatusBase
{
    public static $type;

    protected $currentStatus;

    /**
     * @return RequestStatusEnum[]
     */
    public abstract function getInnerStatues(): array;
    /**
     * @return RequestStatusEnum[]
     */
    public function getStartStatuses():array
    {
        return [
            RequestStatusEnum::NEW,
            RequestStatusEnum::PAYING_TEN,
            RequestStatusEnum::MAKING_CONTRACT,
            RequestStatusEnum::ACCEPTING_CONTRACT,
            RequestStatusEnum::PAYING,
            RequestStatusEnum::ACCEPTING,
            RequestStatusEnum::MEASUREMENTS,
            RequestStatusEnum::MATERIAL_BUYING,
        ];
    }
    /**
     * @return RequestStatusEnum[]
     */
    public function getEndStatuses():array
    {
        return [
            RequestStatusEnum::ASSEMBLY,
            RequestStatusEnum::MOUNTING,
            RequestStatusEnum::MAKING_WORK_REPORT,
            RequestStatusEnum::ACCEPTING_CLIENT,
            RequestStatusEnum::FINISHED,
        ];
    }
    /**
     * @return RequestStatusEnum[]
     */
    public function getStatuses():array
    {
        return array_merge($this->getStartStatuses(), $this->getInnerStatues(),$this->getEndStatuses());
    }

    public function nextStatus():?RequestStatusEnum
    {
        $statuses = $this->getStatuses();

        if ($this->currentStatus){

            $index = array_search($this->currentStatus, $statuses);

            if ($index !== false && isset($statuses[$index + 1])) {
                $next = $statuses[$index + 1];

                return $next;
            }
        }

        if ($this->currentStatus == RequestStatusEnum::FINISHED){
            return null;
        }

        return reset($statuses);
    }

    public function prevStatus():?RequestStatusEnum
    {
        $statuses = $this->getStatuses();

        if ($this->currentStatus){

            $index = array_search($this->currentStatus, $statuses);

            if ($index !== false && isset($statuses[$index - 1])) {
                $next = @$statuses[$index - 1];

                return $next;
            }
        }

        if ($this->currentStatus == RequestStatusEnum::NEW){
            return null;
        }

        return reset($statuses);
    }

    public function setCurrentStatus(RequestStatusEnum $data)
    {
        $this->currentStatus = $data;

        return $this;
    }


    public function show(RequestModel $requestModel)
    {
        $this->setCurrentStatus(RequestStatusEnum::tryFrom($requestModel->request_status_id));

        $statusIds = [];
        foreach ($this->getStatuses() as $status) {
            $statusIds[] = $status->value;
        }

        $statuses = RequestStatus::all();

        $statusesOrdered = [];
        $history = $requestModel->histories;



        foreach ($this->getStatuses() as $status) {
            $getStatus = $statuses->where('id',$status->value)->first();
            $pass = $history->where('request_status_id',$getStatus?->id)->first();
            $statusesOrdered[] = [
                'id'=>$getStatus?->id,
                'name'=>$getStatus?->name,
                'passed_at'=>$pass?->created_at,
                'comment'=>$pass?->comment,
                'media'=>MediaResource::collection($pass?->media ?? []),
//                'pass'=>[
//                    'passed_at'=>$pass?->created_at,
//                    'comment'=>$pass?->comment
//                ],
            ];
        }


        return [

            'next_status'=>[
                'id'=>$statuses->firstWhere('id',$this->nextStatus()?->value)?->id,
                'name'=>$statuses->firstWhere('id',$this->nextStatus()?->value)?->name,
                'can'=>$this->nextStatus()?->role() ? (bool)Auth::user()?->hasRole($this->nextStatus()?->role()) : false,
            ],
            'prev_status'=>[
                'id'=>$statuses->firstWhere('id',$this->prevStatus()?->value)?->id,
                'name'=>$statuses->firstWhere('id',$this->prevStatus()?->value)?->name,
//                'can'=>$this->nextStatus()?->role() ? (bool)Auth::user()?->hasRole($this->prevStatus()?->role()) : false,
            ],
            'data'=>$statusesOrdered
        ];
    }

}
