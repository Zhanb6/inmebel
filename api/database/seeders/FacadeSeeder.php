<?php

namespace Database\Seeders;

use App\Models\Facade;
use App\Models\FacadeColor;
use App\Models\FacadeType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacadeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $facadeType = FacadeType::create([
            'name'=>'Цельные'
        ]);
        $facadeType->addMedia(public_path('/img/Цельный.png'))
            ->preservingOriginal()
            ->toMediaCollection();
        $facadeType = FacadeType::create([
            'name'=>'Рамочные'
        ]);
        $facadeType->addMedia(public_path('/img/Рамочный.png'))
            ->preservingOriginal()
            ->toMediaCollection();
        $facadeType = FacadeType::create([
            'name'=>'Складные'
        ]);
        $facadeType->addMedia(public_path('/img/Складные.png'))
            ->preservingOriginal()
            ->toMediaCollection();
        $facadeType = FacadeType::create([
            'name'=>'Изогнутые или радиусные'
        ]);
        $facadeType->addMedia(public_path('/img/Радиусная.png'))
            ->preservingOriginal()
            ->toMediaCollection();




        FacadeColor::create([
            'name'=>'Бежевый',
            'code'=>'#f5f5dc',
        ]);

        FacadeColor::create([
            'name'=>'Бежево коричневый',
            'code'=>'#c19a6b',
        ]);
        FacadeColor::create([
            'name'=>'Золотисто-коричневый',
            'code'=>'#d4a76a'
        ]);
        FacadeColor::create([
            'name'=>'Пепельно-серый',
            'code'=>'#848789',
        ]);
        FacadeColor::create([
            'name'=>'Серый',
            'code'=>'#43464b',
        ]);


        $facadeTypes = FacadeType::all()->pluck('id')->toArray();
        $facadeColors = FacadeColor::all()->pluck('id')->toArray();

        $facade = Facade::create([
            'name'=>'ЛДСП Россия',
        ]);

        $facade->types()->sync($facadeTypes);
        $facade->colors()->sync($facadeColors);


        $facade = Facade::create([
            'name'=>'ЛДСП Egger',
        ]);

        $facade->types()->sync($facadeTypes);
        $facade->colors()->sync($facadeColors);
        $facade =  Facade::create([
            'name'=>'МДФ краска',
        ]);

        $facade->types()->sync($facadeTypes);
        $facade->colors()->sync($facadeColors);
        $facade = Facade::create([
            'name'=>'МДФ пленка',
        ]);

        $facade->types()->sync($facadeTypes);
        $facade->colors()->sync($facadeColors);
        $facade = Facade::create([
            'name'=>'МДФ шпон',
        ]);

        $facade->types()->sync($facadeTypes);
        $facade->colors()->sync($facadeColors);

     }
}
