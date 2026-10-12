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
        Schema::create('request_additions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('requests')->cascadeOnDelete();
            $table->foreignId('request_addition_status_id')->nullable()->constrained('request_addition_statuses')->nullOnDelete();
            $table->foreignId('furniture_type_id')->constrained('furniture_types')->cascadeOnDelete();
            $table->string('furniture_data_type');
            $table->integer('furniture_data_id');
            $table->text('description')->nullable();
            $table->double('price');
            $table->integer('number');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_additions');
    }
};
