<?php

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function pendingReservationFor(User $user): Reservation
{
    $facility = Facility::factory()->create();

    return Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Rapat organisasi mahasiswa',
        'start_time' => now()->addDays(3),
        'end_time' => now()->addDays(3)->addHours(2),
        'status' => ReservationStatus::Pending,
    ]);
}

test('unverified Pengguna are sent to email verification before submitting a reservation', function () {
    $user = User::factory()->pengguna()->unverified()->withInstitutionalIdentity()->create();

    $response = $this->actingAs($user)->post(route('reservations.store'));

    $response->assertRedirect(route('verification.notice'));
    $this->assertDatabaseCount('reservations', 0);
});

test('unapproved Pengguna cannot submit a reservation even with an authenticated session', function () {
    $user = User::factory()->pengguna()->withInstitutionalIdentity()->create([
        'approved_at' => null,
        'approved_by' => null,
    ]);

    $response = $this->actingAs($user)->post(route('reservations.store'));

    $response->assertForbidden();
    $this->assertDatabaseCount('reservations', 0);
});

test('petugas must provide a reason when rejecting a reservation', function () {
    $petugas = User::factory()->petugas()->create();
    $reservation = pendingReservationFor(User::factory()->pengguna()->create());

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.reject', $reservation));

    $response->assertSessionHasErrors([
        'alasan_penolakan' => 'Alasan penolakan wajib diisi.',
    ]);
    $reservation->refresh();
    expect($reservation->status)->toBe(ReservationStatus::Pending)
        ->and($reservation->alasan_penolakan)->toBeNull()
        ->and($reservation->ditolak_pada)->toBeNull();
});

test('petugas rejection stores its reason and time', function () {
    $petugas = User::factory()->petugas()->create();
    $reservation = pendingReservationFor(User::factory()->pengguna()->create());

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.reject', $reservation), [
        'alasan_penolakan' => 'Dokumen pendukung belum lengkap.',
    ]);

    $response->assertRedirect(route('petugas.reservations.index'));
    $response->assertSessionHas('success');
    $reservation->refresh();
    expect($reservation->status)->toBe(ReservationStatus::Rejected)
        ->and($reservation->alasan_penolakan)->toBe('Dokumen pendukung belum lengkap.')
        ->and($reservation->ditolak_pada)->not->toBeNull();
});

test('approving a reservation records a reason on conflicting pending reservations', function () {
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create();
    $startTime = now()->addDays(3);
    $approvedReservation = Reservation::create([
        'user_id' => User::factory()->pengguna()->create()->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Seminar fakultas',
        'start_time' => $startTime,
        'end_time' => $startTime->copy()->addHours(2),
        'status' => ReservationStatus::Pending,
    ]);
    $conflictingReservation = Reservation::create([
        'user_id' => User::factory()->pengguna()->create()->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Rapat unit kegiatan mahasiswa',
        'start_time' => $startTime->copy()->addHour(),
        'end_time' => $startTime->copy()->addHours(3),
        'status' => ReservationStatus::Pending,
    ]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.approve', $approvedReservation));

    $response->assertRedirect(route('petugas.reservations.index'));
    $conflictingReservation->refresh();
    expect($conflictingReservation->status)->toBe(ReservationStatus::Rejected)
        ->and($conflictingReservation->alasan_penolakan)->toBe('Jadwal berbenturan dengan reservasi lain yang telah disetujui.')
        ->and($conflictingReservation->ditolak_pada)->not->toBeNull();
});

test('reservation history includes rejection details for its owner', function () {
    $user = User::factory()->pengguna()->create();
    $reservation = pendingReservationFor($user);
    $reservation->update([
        'status' => ReservationStatus::Rejected,
        'alasan_penolakan' => 'Jadwal fasilitas sudah digunakan.',
        'ditolak_pada' => '2026-10-01 03:00:00',
    ]);

    $response = $this->actingAs($user)->get(route('reservations.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('reservations/index')
        ->where('reservations.0.id', $reservation->id)
        ->where('reservations.0.alasan_penolakan', 'Jadwal fasilitas sudah digunakan.')
        ->where('reservations.0.ditolak_pada', '01 Oktober 2026, 10:00')
    );
});

test('reservation detail includes rejection details for its owner', function () {
    $user = User::factory()->pengguna()->create();
    $reservation = pendingReservationFor($user);
    $reservation->update([
        'status' => ReservationStatus::Rejected,
        'alasan_penolakan' => 'Fasilitas sedang tidak tersedia.',
        'ditolak_pada' => '2026-10-01 03:00:00',
    ]);

    $response = $this->actingAs($user)->get(route('reservations.show', $reservation));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('reservations/show')
        ->where('reservation.id', $reservation->id)
        ->where('reservation.alasan_penolakan', 'Fasilitas sedang tidak tersedia.')
        ->where('reservation.ditolak_pada', '01 Oktober 2026, 10:00')
    );
});
