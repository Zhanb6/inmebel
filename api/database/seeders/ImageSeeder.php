<?php

namespace Database\Seeders;

use App\Models\FacadeColor;
use App\Models\FacadeType;
use App\Models\FurnitureSubtype;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FacadeColor::all()->each(function ($data) {
            $data->addMediaFromUrl('https://picsum.photos/200/300')->toMediaCollection();
        });

        FacadeType::all()->each(function ($data) {
            $data->addMediaFromUrl('https://picsum.photos/200/300')->toMediaCollection();
        });

        FurnitureSubtype::all()->each(function ($data) {
            $data->addMediaFromUrl('https://picsum.photos/200/300')->toMediaCollection();
        });
    }
}
