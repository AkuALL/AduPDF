<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table): void {
            $table->string('status')->default('menunggu')->change();
        });
    }

    public function down(): void
    {
        if (DB::table('reservations')->where('status', 'kedaluwarsa')->exists()) {
            throw new \RuntimeException('Cannot remove expired status while expired reservations exist.');
        }

        Schema::table('reservations', function (Blueprint $table): void {
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak', 'dibatalkan'])->default('menunggu')->change();
        });
    }
};
