<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('furniture_type_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('furniture_type_id')->constrained('furniture_types')->cascadeOnDelete();
            $table->foreignId('facade_id')->constrained('facades')->cascadeOnDelete();
            $table->foreignId('frame_id')->constrained('frames')->cascadeOnDelete();
            $table->double('price');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement("
                CREATE UNIQUE INDEX furniture_type_prices_facade_id_frame_id_unique
                ON furniture_type_prices (furniture_type_id,facade_id,frame_id)
                WHERE deleted_at IS NULL;
            ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('furniture_type_prices');
    }
};
