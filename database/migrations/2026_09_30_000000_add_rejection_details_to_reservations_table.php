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
        Schema::table('reservations', function (Blueprint $table): void {
            $table->text('alasan_penolakan')->nullable()->after('status');
            $table->timestamp('ditolak_pada')->nullable()->after('alasan_penolakan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table): void {
            $table->dropColumn(['alasan_penolakan', 'ditolak_pada']);
        });
    }
};
