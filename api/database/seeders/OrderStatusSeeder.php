<?php

namespace Database\Seeders;

use App\Models\OrderStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrderStatus::create([
            'name'=>'В обработке'
        ]);

        OrderStatus::create([
            'name'=>'Выехал от поставщика'
        ]);

        OrderStatus::create([
            'name'=>'Заказ на пункте распределение'
        ]);

        OrderStatus::create([
            'name'=>'Заказ доехал до города'
        ]);

        OrderStatus::create([
            'name'=>'Заказ в службе доставки'
        ]);

        OrderStatus::create([
            'name'=>'Доставка'
        ]);
    }
}
