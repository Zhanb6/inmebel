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
        Schema::create('signed_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_id')->constrained('media');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_phone');
            $table->string('user_name');
            $table->string('user_iin');
            $table->string('signed_phone');
            $table->string('signed_phone_code');
            $table->string('ip_address');
            $table->string('user_agent');
            $table->string('file_hash');
            $table->string('file_hash_method')->default('sha256');
            $table->binary('file');
            $table->string('file_mime_type');
            $table->string('file_name');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signed_media');
    }
};
