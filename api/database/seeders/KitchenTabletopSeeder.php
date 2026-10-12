<?php

namespace Database\Seeders;

use App\Models\KitchenTabletop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KitchenTabletopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KitchenTabletop::create([
            'name'=>'ЛДСП термопластик',
            'price'=>0,
        ]);

        KitchenTabletop::create([
            'name'=>'ЛДСП термопластик Egger',
            'price'=>40000,
        ]);
        KitchenTabletop::create([
            'name'=>'Искусственный камень',
            'price'=>125000,
        ]);
        KitchenTabletop::create([
            'name'=>'Кварц',
            'price'=>240000,
        ]);
        KitchenTabletop::create([
            'name'=>'HPL',
            'price'=>140000,
        ]);
    }
}
