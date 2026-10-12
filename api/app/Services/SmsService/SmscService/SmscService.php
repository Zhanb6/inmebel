<?php

namespace App\Services\SmsService\SmscService;
use App\Services\SmsService\SmsServiceInterface;

require_once app_path('Services/SmsService/SmscService/smsc_api.php');

class SmscService implements SmsServiceInterface
{

    public function send(string $phone, string $message)
    {
        //TODO расскаментить когда будет прод
//        return send_sms($phone, mb_convert_encoding($message, 'Windows-1251', 'UTF-8'));
    }
}
