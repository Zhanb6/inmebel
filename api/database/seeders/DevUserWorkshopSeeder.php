<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DevUserWorkshopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        for ($i = 0; $i < 50; $i++) {

            $user = User::create([
                'name' => fake()->name,
                'phone' => phone_format('+7'.fake()->numberBetween(1000000000,9999999999)),
                'password' => Hash::make('password'),
            ]);



            $queue = fake()->numberBetween(1, 3);

            switch ($queue) {
                case 1:
                    $workshop = $user->workshops()->create([
                        'name'=>fake()->company(),
                        'iin'=>fake()->numberBetween(1000000000, 9999999999),
                        'address'=>fake()->address(),
                        'description'=>fake()->text(),
                    ]);

                    for ($y = 0; $y < 5; $y++) {
                        $workshop->price_lists()->create([
                            'name' => fake()->word(),
                            'price' => fake()->numberBetween(10000, 200000),
                        ]);
                    }

                    for ($y = 0; $y < 5; $y++) {
                        $person = User::query()->inRandomOrder()->first();

                        $workshop->reviews()->create([
                            'person_type'=>$person->getMorphClass(),
                            'person_id'=>$person->id,
                            'star' => fake()->randomFloat(1,1,5),
                            'comment' => fake()->text(),
                        ]);
                    }

                    $user->workshops()->each(function (Workshop $workshop) {
                        for ($i = 0; $i < 30; $i++) {
                            $product = $workshop->products()->create([
                                'name'=>fake()->name,
                                'description'=>fake()->text(),
                                'price'=>fake()->numberBetween(100, 1000),
                            ]);

                            for ($y = 0; $y < 5; $y++) {
                                $person = User::query()->inRandomOrder()->first();

                                $product->reviews()->create([
                                    'person_type'=>$person->getMorphClass(),
                                    'person_id'=>$person->id,
                                    'star' => fake()->randomFloat(1,1,5),
                                    'comment' => fake()->text(),
                                ]);
                            }
                        }
                    });

                    $user->assignRole(RoleEnum::WORKSHOP->value);
                    break;
                case 2:
                    $user->seller_data()->create([
                        'name'=>fake()->company(),
                        'iin'=>fake()->numberBetween(1000000000, 9999999999),
                        'address'=>fake()->address(),
                    ]);

                    $user->assignRole(RoleEnum::SELLER->value);
                    break;
                case 3:
                    $user->client_data()->create([
                        'iin'=>fake()->numberBetween(1000000000, 9999999999),
                    ]);

                    $user->assignRole(RoleEnum::CLIENT->value);
                    break;
            }

        }



    }
}
