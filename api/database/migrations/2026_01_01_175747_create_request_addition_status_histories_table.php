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
        Schema::create('request_addition_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_addition_id')->constrained('request_additions')->cascadeOnDelete();
            $table->foreignId('request_addition_status_id')->constrained('request_addition_statuses')->cascadeOnDelete();
            $table->text('comment')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['request_addition_id', 'request_addition_status_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_addition_status_histories');
    }
};
