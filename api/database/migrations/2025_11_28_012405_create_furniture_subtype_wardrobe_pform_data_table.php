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
        Schema::create('furniture_subtype_wardrobe_pform_data', function (Blueprint $table) {
            $table->id();
            $table->double('height');
            $table->double('length_first');
            $table->double('length_second');
            $table->double('length_third');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('furniture_subtype_wardrobe_pform_data');
    }
};
