<?php

namespace App\Services\SmsService;

interface SmsServiceInterface
{
    public function send(string $phone, string $message);
}
