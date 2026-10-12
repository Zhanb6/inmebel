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
        Schema::create('mirrors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mirror_form_id')->constrained('mirror_forms')->cascadeOnDelete();
            $table->foreignId('mirror_backlight_id')->constrained('mirror_backlights')->cascadeOnDelete();
            $table->foreignId('mirror_frame_id')->nullable()->constrained('mirror_frames')->nullOnDelete();
            $table->double('length');
            $table->double('height');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mirrors');
    }
};
