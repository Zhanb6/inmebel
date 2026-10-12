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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('workshop_id')->constrained('workshops')->cascadeOnDelete();
            $table->foreignId('furniture_type_id')->constrained('furniture_types')->cascadeOnDelete();
            $table->foreignId('request_status_id')->nullable()->constrained('request_statuses')->nullOnDelete();
            $table->string('furniture_data_type');
            $table->integer('furniture_data_id');

            $table->text('description')->nullable();
            $table->double('price');
            $table->double('price_from');
            $table->double('price_to');

            $table->string('client_name');
            $table->string('client_iin');
            $table->string('client_phone');
            $table->string('client_address');

            $table->date('request_contract_date')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
