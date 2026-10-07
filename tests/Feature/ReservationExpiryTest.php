<?php

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('pending reservations that reach their start time are rejected with an expiry reason', function () {
    $now = now()->startOfMinute();
    $this->travelTo($now);

    $user = User::factory()->pengguna()->create();
    $facility = Facility::factory()->create();

    $overdueReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan yang belum disetujui',
        'start_time' => $now->copy()->subMinute(),
        'end_time' => $now->copy()->addHour(),
        'status' => ReservationStatus::Pending,
    ]);

    $futureReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan mendatang',
        'start_time' => $now->copy()->addHour(),
        'end_time' => $now->copy()->addHours(2),
        'status' => ReservationStatus::Pending,
    ]);

    $approvedReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan yang sudah disetujui',
        'start_time' => $now->copy()->subMinute(),
        'end_time' => $now->copy()->addHour(),
        'status' => ReservationStatus::Approved,
    ]);

    $this->artisan('reservations:expire')->assertExitCode(0);

    $overdueReservation->refresh();
    expect($overdueReservation->status)->toBe(ReservationStatus::Rejected)
        ->and($overdueReservation->alasan_penolakan)->toBe('Pengajuan ditolak otomatis karena belum disetujui hingga waktu reservasi dimulai (kedaluwarsa).')
        ->and($overdueReservation->ditolak_pada?->toDateTimeString())->toBe($now->toDateTimeString());

    $futureReservation->refresh();
    expect($futureReservation->status)->toBe(ReservationStatus::Pending)
        ->and($futureReservation->alasan_penolakan)->toBeNull()
        ->and($futureReservation->ditolak_pada)->toBeNull();

    $approvedReservation->refresh();
    expect($approvedReservation->status)->toBe(ReservationStatus::Approved)
        ->and($approvedReservation->alasan_penolakan)->toBeNull()
        ->and($approvedReservation->ditolak_pada)->toBeNull();
});

test('legacy expired reservations are migrated to rejected with an expiry reason', function () {
    $reservation = Reservation::create([
        'user_id' => User::factory()->pengguna()->create()->id,
        'facility_id' => Facility::factory()->create()->id,
        'tujuan' => 'Reservasi lama yang kedaluwarsa',
        'start_time' => now()->subMinute(),
        'end_time' => now()->addHour(),
        'status' => ReservationStatus::Rejected,
    ]);

    DB::table('reservations')->where('id', $reservation->id)->update([
        'status' => 'kedaluwarsa',
        'alasan_penolakan' => null,
    ]);

    $migration = require database_path('migrations/2026_10_07_100657_convert_expired_reservations_to_rejected_status.php');
    $migration->up();

    $reservation->refresh();
    expect($reservation->status)->toBe(ReservationStatus::Rejected)
        ->and($reservation->alasan_penolakan)->toBe('Pengajuan ditolak otomatis karena belum disetujui hingga waktu reservasi dimulai (kedaluwarsa).');
});
