<?php

namespace App\Notifications\Channels;

use App\Services\SmsService\SmsServiceInterface;
use Illuminate\Notifications\Notification;

class SmsChannel
{
    public function __construct(public SmsServiceInterface $service)
    {

    }

    public function send(object $notifiable, Notification $notification): void
    {
        $data = $notification->toSms($notifiable);

        // Send notification to the $notifiable instance...
        $this->service->send(@$data['phone'],@$data['message']);
    }
}
