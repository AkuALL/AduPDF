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
        if (! Schema::hasColumn('reservations', 'alasan_penolakan')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->text('alasan_penolakan')->nullable()->after('status');
            });
        }

        if (! Schema::hasColumn('reservations', 'ditolak_pada')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->timestamp('ditolak_pada')->nullable()->after('alasan_penolakan');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('reservations', 'ditolak_pada')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->dropColumn('ditolak_pada');
            });
        }

        if (Schema::hasColumn('reservations', 'alasan_penolakan')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->dropColumn('alasan_penolakan');
            });
        }
    }
};
