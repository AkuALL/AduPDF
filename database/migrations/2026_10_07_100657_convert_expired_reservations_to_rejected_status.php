<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const string EXPIRY_REJECTION_REASON = 'Pengajuan ditolak otomatis karena belum disetujui hingga waktu reservasi dimulai (kedaluwarsa).';

    public function up(): void
    {
        DB::table('reservations')
            ->where('status', 'kedaluwarsa')
            ->update([
                'status' => 'ditolak',
                'alasan_penolakan' => self::EXPIRY_REJECTION_REASON,
            ]);
    }

    public function down(): void
    {
        DB::table('reservations')
            ->where('status', 'ditolak')
            ->where('alasan_penolakan', self::EXPIRY_REJECTION_REASON)
            ->update([
                'status' => 'kedaluwarsa',
                'alasan_penolakan' => null,
                'ditolak_pada' => null,
            ]);
    }
};
