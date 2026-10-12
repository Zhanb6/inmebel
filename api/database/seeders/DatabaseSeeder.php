<?php

namespace Database\Seeders;

use App\Enums\FurnitureAddonDataTypeEnum;
use App\Models\FurnitureSubtype;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

//        $this->call([
//            RoleSeeder::class,
//            AdminSeeder::class,
//        ]);

        $this->call([
            RoleSeeder::class,
            AdminSeeder::class,
            FacadeSeeder::class,
            FurnitureTypeSeeder::class,
            RequestStatusSeeder::class,
            ProdUserWorkshopSeeder::class,


            FrameSeeder::class,
            FillingSeeder::class,

            BrandSeeder::class,
            FurnitureAddonSeeder::class,
            FurnitureSubtypeSeeder::class,

            AttributeSeeder::class,
            CategorySeeder::class,
            FurnitureTypeBrandSeeder::class,
            KitchenTabletopSeeder::class,
            FurnitureTypeFurnitureAddonSeeder::class,
            FurnitureTypePriceSeeder::class,
            MirrorFormSeeder::class,
            MirrorBacklightSeeder::class,
            MirrorPriceSeeder::class,
            MirrorFrameSeeder::class,
            ConsoleTabletopSeeder::class,
            OrderStatusSeeder::class,
            RequestAdditionStatusSeeder::class,
//            ProductSeeder::class,
        ]);
    }
}
