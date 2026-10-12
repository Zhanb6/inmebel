<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

if (!function_exists('phone_format')) {
    function phone_format($phone)
    {
        // Удаляем все, кроме цифр
        $digits = preg_replace('/\D/', '', $phone);


        // Если номер начинается с 8, заменяем на 7
        if (strlen($digits) === 11 && $digits[0] === '8') {
            $digits = '7' . substr($digits, 1);
        }

        // Добавляем +7 в начало, если не хватает
        if (strlen($digits) === 10) {
            $digits = '7' . $digits;
        }

        // Проверяем, что в итоге 11 цифр и начинается с 7
        return (strlen($digits) === 11 && $digits[0] === '7') ? "+$digits" : null;

    }
}

if (!function_exists('whatsapp_phone_format')) {
    function whatsapp_phone_format($phone)
    {
        // Удаляем все, кроме цифр
        $digits = preg_replace('/\D/', '', $phone);


        // Если номер начинается с 8, заменяем на 7
        if (strlen($digits) === 11 && $digits[0] === '8') {
            $digits = '7' . substr($digits, 1);
        }

        // Добавляем +7 в начало, если не хватает
        if (strlen($digits) === 10) {
            $digits = '7' . $digits;
        }

        // Проверяем, что в итоге 11 цифр и начинается с 7
        return (strlen($digits) === 11 && $digits[0] === '7') ? "$digits" : null;

    }
}

if (!function_exists('response_success')) {
    function response_success()
    {
       return response()->json([
           'message' => 'Success!',
       ]);
    }
}

if (!function_exists('check_access')) {
    function check_access($access,$model)
    {

        abort_if(Gate::forUser(Auth::user())->denies($access,$model), Response::HTTP_FORBIDDEN, __('Forbidden'));

    }
}

if (!function_exists('check_access_without_abort')) {
    function check_access_without_abort($access,$model):bool
    {

        return Gate::forUser(Auth::user())->allows($access,$model);
    }
}

if (!function_exists('check_access_bool')) {
    function check_access_bool(bool $access)
    {
        abort_if(!$access, Response::HTTP_FORBIDDEN, __('Forbidden'));

    }
}

if (!function_exists('buildRegexFromPattern')) {
    function buildRegexFromPattern(string $pattern): string
    {
        // Экранируем спецсимволы для regex
        $escapedPattern = preg_quote($pattern, '/');

        // заменяем экранированные {param} → (?P<param>[a-zA-Z0-9_-]+)
        $regex = preg_replace_callback('/\\\\{(\w+)\\\\}/', function ($m) {
            return '(?P<' . $m[1] . '>[a-zA-Z0-9_-]+)';
        }, $escapedPattern);

        return '/^' . $regex . '$/';
    }
}

if (!function_exists('format_id')) {
    function format_id($number) {
        return str_pad($number, 6, '0', STR_PAD_LEFT);
    }
}
