<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('furniture_addon_mirror_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('furniture_addon_id')->constrained('furniture_addons')->cascadeOnDelete();
            $table->double('length');
            $table->double('height');
            $table->integer('count')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('furniture_addon_mirror_data');
    }
};
