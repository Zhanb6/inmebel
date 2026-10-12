<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProdUserWorkshopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $user = User::create([
            'name' => 'In mebel',
            'phone' => '+77750098609',
            'password' => Hash::make('Password1'),
        ]);
        $user->assignRole(RoleEnum::WORKSHOP->value);

        $workshop = Workshop::create([
            'name'=>'ИП «IN MEBEL»',
            'iin'=>'910501451133',
            'address'=>'РК, г.Астана ул. А 91, 12/441',
            'description'=>"ИП «IN MEBEL» — это компания, специализирующаяся на изготовлении мебели по индивидуальным размерам и пожеланиям клиента. Мы создаём удобную, стильную и функциональную мебель, которая идеально вписывается в любое пространство — от квартир и домов до офисов и коммерческих помещений.

Наши специалисты предлагают полный цикл работ: от выезда на замеры и разработки дизайн-проекта до производства и установки готовых изделий. Мы работаем с широким ассортиментом материалов и фурнитуры, что позволяет реализовать мебель любого уровня сложности — кухни, шкафы-купе, гардеробные, столы, тумбы, стенки, детские и другую корпусную мебель.

Главная ценность IN MEBEL — индивидуальный подход к каждому заказу. Мы учитываем стиль интерьера, пожелания по функциональности и бюджет клиента, чтобы создавать мебель, которая будет радовать многие годы.",
            'bic'=>'CASPKZKA',
            'bank'=>'АҚ/АО «Kaspi Bank»',
            'director_name'=>'Бейсембаева С.А.',
            'iic'=>'KZ24722S000039145797 ',
            'bc'=>'17',
            'city'=>'г. Астана',
        ]);

        $user->workshops()->attach($workshop->id);

        $user = User::create([
            'name' => fake()->name,
            'phone' => '+77750098608',
            'password' => Hash::make('Password1'),
        ]);

        $user->client_data()->create([
            'iin'=>fake()->numberBetween(1000000000, 9999999999),
            'address'=>fake()->address,
        ]);

        $user->assignRole(RoleEnum::CLIENT->value);
    }
}
