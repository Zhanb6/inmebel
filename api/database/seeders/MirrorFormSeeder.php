<?php

namespace Database\Seeders;

use App\Models\MirrorForm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MirrorFormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MirrorForm::create([
            'name' => 'Прямоугольные',
        ]);

        MirrorForm::create([
            'name' => 'Круглые (овальные)',
        ]);

        MirrorForm::create([
            'name' => 'Дизайнерское',
        ]);

        MirrorForm::create([
            'name' => 'Фатцет',
        ]);

    }
}
