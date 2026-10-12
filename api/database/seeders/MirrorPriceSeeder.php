<?php

namespace Database\Seeders;

use App\Models\MirrorPrice;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MirrorPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MirrorPrice::create([
            'mirror_form_id'=>1,
            'mirror_backlight_id'=>1,
            'price'=>30000,
            'price_add'=>0,
        ]);

        MirrorPrice::create([
            'mirror_form_id'=>1,
            'mirror_backlight_id'=>2,
            'price'=>46000,
            'price_add'=>0,
        ]);

        MirrorPrice::create([
            'mirror_form_id'=>1,
            'mirror_backlight_id'=>3,
            'price'=>80000,
            'price_add'=>0,
        ]);


        MirrorPrice::create([
            'mirror_form_id'=>2,
            'mirror_backlight_id'=>1,
            'price'=>30000,
            'price_add'=>15000,
        ]);

        MirrorPrice::create([
            'mirror_form_id'=>2,
            'mirror_backlight_id'=>2,
            'price'=>46000,
            'price_add'=>15000,
        ]);

        MirrorPrice::create([
            'mirror_form_id'=>2,
            'mirror_backlight_id'=>3,
            'price'=>80000,
            'price_add'=>15000,
        ]);


        MirrorPrice::create([
            'mirror_form_id'=>3,
            'mirror_backlight_id'=>1,
            'price'=>30000,
            'price_add'=>25000,
        ]);

        MirrorPrice::create([
            'mirror_form_id'=>3,
            'mirror_backlight_id'=>2,
            'price'=>46000,
            'price_add'=>25000,
        ]);

        MirrorPrice::create([
            'mirror_form_id'=>3,
            'mirror_backlight_id'=>3,
            'price'=>80000,
            'price_add'=>25000,
        ]);


        MirrorPrice::create([
            'mirror_form_id'=>4,
            'mirror_backlight_id'=>1,
            'price'=>60000,
            'price_add'=>0,
        ]);

    }
}
