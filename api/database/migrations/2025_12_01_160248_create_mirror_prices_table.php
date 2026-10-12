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
        Schema::create('mirror_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mirror_form_id')->constrained('mirror_forms')->cascadeOnDelete();
            $table->foreignId('mirror_backlight_id')->constrained('mirror_backlights')->cascadeOnDelete();
            $table->double('price');
            $table->double('price_add')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mirror_prices');
    }
};
