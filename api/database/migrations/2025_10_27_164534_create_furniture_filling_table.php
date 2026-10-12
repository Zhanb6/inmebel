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
        Schema::create('furniture_filling', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('furniture_id');
            $table->string('furniture_type');
            $table->foreignId('filling_id')->constrained('fillings')->cascadeOnDelete();
            $table->integer('count');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('furniture_filling');
    }
};
