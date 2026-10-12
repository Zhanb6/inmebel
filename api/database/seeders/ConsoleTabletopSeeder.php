<?php

namespace Database\Seeders;

use App\Models\ConsoleSink;
use App\Models\ConsoleTabletop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConsoleTabletopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          ConsoleSink::create([
            'name'=>'Прямоугольной формы'
        ]);
       ConsoleSink::create([
            'name'=>'Овальной формы'
        ]);





        $data = ConsoleTabletop::create([
            'name'=>'ЛДСП термопластик Россия',
            'price'=>30000,
        ]);

        $data->sinks()->attach([1=>[
            'price'=>140000
        ],
            2=>[
                'price'=>120000
            ]
        ]);

        $data = ConsoleTabletop::create([
            'name'=>'ЛДСП термопластик Egger',
            'price'=>60000,
        ]);

        $data->sinks()->attach([1=>[
            'price'=>140000
        ],
            2=>[
                'price'=>120000
            ]
        ]);

        ConsoleTabletop::create([
            'name'=>'Искусственный камень',
            'price'=>125000,
        ]);
        ConsoleTabletop::create([
            'name'=>'Кварц',
            'price'=>240000,
        ]);
        ConsoleTabletop::create([
            'name'=>'HPL',
            'price'=>140000,
        ]);
    }
}
