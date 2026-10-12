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
        Schema::create('closets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('furniture_subtype_id')->constrained('furniture_subtypes')->cascadeOnDelete();
            $table->foreignId('frame_id')->constrained('frames')->cascadeOnDelete();
            $table->foreignId('facade_id')->constrained('facades')->cascadeOnDelete();
            $table->foreignId('facade_type_id')->constrained('facade_types')->cascadeOnDelete();
            $table->foreignId('facade_color_id')->constrained('facade_colors')->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();

            $table->double('length');
            $table->double('height');


            $table->bigInteger('furniture_subtype_data_id')->nullable();
            $table->string('furniture_subtype_data_type')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('closets');
    }
};
