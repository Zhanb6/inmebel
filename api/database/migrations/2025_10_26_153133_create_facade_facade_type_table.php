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
        Schema::create('facade_facade_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facade_id')->constrained('facades')->cascadeOnDelete();
            $table->foreignId('facade_type_id')->constrained('facade_types')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facade_facade_type');
    }
};
