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
        Schema::create('workshops', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('iin')->nullable();
            $table->string('address')->nullable();
            $table->dateTime('accepted_at')->nullable();
            $table->text('description')->nullable();

            $table->string('bic')->nullable()->comment('Банковский идентификационный код (БИК)');
            $table->string('bank')->nullable();
            $table->string('director_name')->nullable();
            $table->string('iic')->nullable()->comment('Индивидуальный идентификационный код (ИИК)');
            $table->string('bc')->nullable()->comment('Код бенефициара (Кбе)');
            $table->string('city')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workshops');
    }
};
