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
        Schema::create('console_tabletop_sink', function (Blueprint $table) {
            $table->id();
            $table->foreignId('console_tabletop_id')->constrained('console_tabletops');
            $table->foreignId('console_sink_id')->constrained('console_sinks');
            $table->double('price');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('console_tabletop_sink');
    }
};
