<?php

namespace App\Services\RequestAdditionService\RequestAdditionStatusService;

use App\Enums\RequestAdditionStatusEnum;
use App\Http\Resources\Media\MediaResource;
use App\Models\RequestAddition;
use App\Models\RequestAdditionStatus;

class RequestAdditionStatusService
{
    public static function getStatuses():array
    {
        return [
            RequestAdditionStatusEnum::NEW,
            RequestAdditionStatusEnum::MAKING_DOCUMENT,
            RequestAdditionStatusEnum::ACCEPTING_WORKSHOP,
            RequestAdditionStatusEnum::PAYING,
            RequestAdditionStatusEnum::FINISHED,
        ];
    }

    public static function nextStatus(RequestAddition $requestAddition):?RequestAdditionStatusEnum
    {
        $statuses = static::getStatuses();

        $currentStatus = RequestAdditionStatusEnum::tryFrom($requestAddition->request_addition_status_id);
        if ($currentStatus){

            $index = array_search($currentStatus, $statuses);

            if ($index !== false && isset($statuses[$index + 1])) {
                return $statuses[$index + 1];
            }
        }

        if ($currentStatus == RequestAdditionStatusEnum::FINISHED){
            return null;
        }

        return reset($statuses);
    }

    public static function prevStatus(RequestAddition $requestAddition):?RequestAdditionStatusEnum
    {
        $statuses = static::getStatuses();

        $currentStatus = RequestAdditionStatusEnum::tryFrom($requestAddition->request_addition_status_id);
        if ($currentStatus){

            $index = array_search($currentStatus, $statuses);

            if ($index !== false && isset($statuses[$index - 1])) {
                return $statuses[$index - 1];
            }
        }

        if ($currentStatus == RequestAdditionStatusEnum::NEW){
            return null;
        }

        return reset($statuses);
    }

    public static function show(RequestAddition $requestAddition)
    {
        foreach (static::getStatuses() as $status) {
            $statusIds[] = $status->value;
        }

        $statuses = RequestAdditionStatus::all();

        $statusesOrdered = [];
        $history = $requestAddition->histories;



        foreach (static::getStatuses() as $status) {
            $getStatus = $statuses->where('id',$status->value)->first();
            $pass = $history->where('request_addition_status_id',$getStatus?->id)->first();
            $statusesOrdered[] = [
                'id'=>$getStatus?->id,
                'name'=>$getStatus?->name,
                'passed_at'=>$pass?->created_at,
//                'comment'=>$pass?->comment,
                'media'=>MediaResource::collection($pass?->media ?? []),
//                'pass'=>[
//                    'passed_at'=>$pass?->created_at,
//                    'comment'=>$pass?->comment
//                ],
            ];
        }


        return [

            'next_status'=>[
                'id'=>$statuses->firstWhere('id',static::nextStatus($requestAddition)?->value)?->id,
                'name'=>$statuses->firstWhere('id',static::nextStatus($requestAddition)?->value)?->name,
            ],
            'prev_status'=>[
                'id'=>$statuses->firstWhere('id',static::prevStatus($requestAddition)?->value)?->id,
                'name'=>$statuses->firstWhere('id',static::prevStatus($requestAddition)?->value)?->name,
            ],
            'data'=>$statusesOrdered
        ];
    }
}
