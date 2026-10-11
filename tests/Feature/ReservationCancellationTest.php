<?php

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;

test('pengguna dapat membatalkan reservasi miliknya yang berstatus menunggu jika >= 48 jam sebelum jadwal dimulai (BR-11)', function (ReservationStatus $status) {
    $user = User::factory()->create(['role' => 'pengguna', 'approved_at' => now()]);
    $facility = Facility::factory()->create(['condition' => 'aktif']);

    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan pengujian batal reservasi',
        'start_time' => now()->addHours(72),
        'end_time' => now()->addHours(74),
        'status' => $status,
    ]);

    $response = $this->actingAs($user)
        ->from(route('reservations.show', $reservation))
        ->patch("/reservations/{$reservation->id}/cancel");

    $response->assertRedirect(route('reservations.show', $reservation));
    $response->assertSessionHas('success', 'Reservasi berhasil dibatalkan.');

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Cancelled);
})->with([
    'menunggu' => ReservationStatus::Pending,
]);

test('pengguna tidak dapat membatalkan reservasi jika kurang dari 48 jam sebelum jadwal dimulai (BR-11)', function () {
    $user = User::factory()->create(['role' => 'pengguna', 'approved_at' => now()]);
    $facility = Facility::factory()->create(['condition' => 'aktif']);

    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan pengujian batal reservasi mepet',
        'start_time' => now()->addHours(24),
        'end_time' => now()->addHours(26),
        'status' => ReservationStatus::Pending,
    ]);

    $response = $this->actingAs($user)
        ->from(route('reservations.show', $reservation))
        ->patch("/reservations/{$reservation->id}/cancel");

    $response->assertSessionHasErrors('reservation');
    expect($reservation->fresh()->status)->toBe(ReservationStatus::Pending);
});

test('pengguna tidak dapat membatalkan reservasi yang sudah disetujui, ditolak atau dibatalkan', function (ReservationStatus $status) {
    $user = User::factory()->create(['role' => 'pengguna', 'approved_at' => now()]);
    $facility = Facility::factory()->create(['condition' => 'aktif']);

    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan sudah selesai atau tidak aktif',
        'start_time' => now()->addHours(72),
        'end_time' => now()->addHours(74),
        'status' => $status,
    ]);

    $response = $this->actingAs($user)
        ->from(route('reservations.show', $reservation))
        ->patch("/reservations/{$reservation->id}/cancel");

    $response->assertSessionHasErrors('reservation');
    expect($reservation->fresh()->status)->toBe($status);
})->with([
    'disetujui' => ReservationStatus::Approved,
    'ditolak' => ReservationStatus::Rejected,
    'dibatalkan' => ReservationStatus::Cancelled,
]);

test('pengguna tidak dapat membatalkan reservasi milik pengguna lain', function () {
    $user1 = User::factory()->create(['role' => 'pengguna', 'approved_at' => now()]);
    $user2 = User::factory()->create(['role' => 'pengguna', 'approved_at' => now()]);
    $facility = Facility::factory()->create(['condition' => 'aktif']);

    $reservation = Reservation::create([
        'user_id' => $user1->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan user lain',
        'start_time' => now()->addHours(72),
        'end_time' => now()->addHours(74),
        'status' => ReservationStatus::Pending,
    ]);

    $response = $this->actingAs($user2)
        ->patch("/reservations/{$reservation->id}/cancel");

    $response->assertForbidden();
    expect($reservation->fresh()->status)->toBe(ReservationStatus::Pending);
});
