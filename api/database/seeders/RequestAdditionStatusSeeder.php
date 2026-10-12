<?php

namespace Database\Seeders;

use App\Models\RequestAdditionStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RequestAdditionStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RequestAdditionStatus::create([
            'name'=>'Новая заявка',
        ]);

        RequestAdditionStatus::create([
            'name'=>'Сформировать документ',
        ]);

        RequestAdditionStatus::create([
            'name'=>'Подпись цеха',
        ]);

        RequestAdditionStatus::create([
            'name'=>'Оплата или возврат',
        ]);

        RequestAdditionStatus::create([
            'name'=>'Завершен',
        ]);
    }
}
