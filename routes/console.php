<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('reservations:expire', function (): void {
    $rejectedAt = now();
    $rejectionReason = 'Pengajuan ditolak otomatis karena belum disetujui hingga waktu reservasi dimulai (kedaluwarsa).';

    $count = Reservation::query()
        ->where('status', ReservationStatus::Pending->value)
        ->where('start_time', '<=', $rejectedAt)
        ->update([
            'status' => ReservationStatus::Rejected->value,
            'alasan_penolakan' => $rejectionReason,
            'ditolak_pada' => $rejectedAt,
        ]);

    $this->info("{$count} pending reservations rejected because their start time arrived.");
})->purpose('Reject pending reservations when their start time arrives');
