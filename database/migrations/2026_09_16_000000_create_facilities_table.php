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
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->enum('type', ['ruang_kelas', 'aula', 'laboratorium', 'alat', 'lapangan']);
            $table->string('location', 100);
            $table->unsignedInteger('capacity')->default(0);
            $table->text('description')->nullable();
            $table->enum('condition', ['aktif', 'dalam_perbaikan', 'nonaktif'])->default('aktif');
            $table->foreignId('parent_facility_id')->nullable()->constrained('facilities')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
