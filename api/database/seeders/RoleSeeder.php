<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' => RoleEnum::ADMIN->value]);
        Role::create(['name' => RoleEnum::WORKSHOP->value]);
        Role::create(['name' => RoleEnum::SELLER->value]);
        Role::create(['name' => RoleEnum::CLIENT->value]);
    }
}
