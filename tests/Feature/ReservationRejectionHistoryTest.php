<?php

use App\Enums\FacilityCondition;
use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('petugas must provide a reason when rejecting a reservation', function () {
    $petugas = User::factory()->petugas()->create();
    $user = User::factory()->pengguna()->create();
    $facility = Facility::factory()->create(['condition' => FacilityCondition::Active]);
    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Rapat organisasi mahasiswa',
        'start_time' => now()->addDays(3),
        'end_time' => now()->addDays(3)->addHours(2),
        'status' => ReservationStatus::Pending,
    ]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.reject', $reservation));

    $response->assertSessionHasErrors('alasan_penolakan');
    expect($reservation->refresh()->status)->toBe(ReservationStatus::Pending)
        ->and($reservation->alasan_penolakan)->toBeNull()
        ->and($reservation->ditolak_pada)->toBeNull();
});

test('petugas rejection stores its reason and rejection time', function () {
    $petugas = User::factory()->petugas()->create();
    $user = User::factory()->pengguna()->create();
    $facility = Facility::factory()->create(['condition' => FacilityCondition::Active]);
    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan tanpa surat izin',
        'start_time' => now()->addDays(4),
        'end_time' => now()->addDays(4)->addHours(2),
        'status' => ReservationStatus::Pending,
    ]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.reject', $reservation), [
        'alasan_penolakan' => 'Surat izin kegiatan belum dilampirkan.',
    ]);

    $response->assertRedirect(route('petugas.reservations.index'));
    $response->assertSessionHas('success');
    expect($reservation->refresh()->status)->toBe(ReservationStatus::Rejected)
        ->and($reservation->alasan_penolakan)->toBe('Surat izin kegiatan belum dilampirkan.')
        ->and($reservation->ditolak_pada)->not->toBeNull();
});

test('pengguna sees the rejection reason and time in reservation history and detail', function () {
    $this->withoutVite();
    $user = User::factory()->pengguna()->create();
    $facility = Facility::factory()->create([
        'name' => 'Lapangan Basket',
        'condition' => FacilityCondition::Active,
    ]);
    $rejectedAt = now()->setTimezone('Asia/Jakarta')->setTime(10, 30)->utc();
    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Latihan rutin UKM',
        'start_time' => now()->addDays(5),
        'end_time' => now()->addDays(5)->addHours(2),
        'status' => ReservationStatus::Rejected,
        'alasan_penolakan' => 'Jadwal digunakan untuk kegiatan fakultas.',
        'ditolak_pada' => $rejectedAt,
    ]);

    $historyResponse = $this->actingAs($user)->get(route('reservations.index'));

    $historyResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('reservations/index')
        ->has('reservations', 1)
        ->where('reservations.0.id', $reservation->id)
        ->where('reservations.0.status', 'ditolak')
        ->where('reservations.0.alasan_penolakan', 'Jadwal digunakan untuk kegiatan fakultas.')
        ->where('reservations.0.ditolak_pada', $rejectedAt->setTimezone('Asia/Jakarta')->format('d M Y, H:i'))
    );

    $detailResponse = $this->actingAs($user)->get(route('reservations.show', $reservation));

    $detailResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('reservations/show')
        ->where('reservation.id', $reservation->id)
        ->where('reservation.status', 'ditolak')
        ->where('reservation.alasan_penolakan', 'Jadwal digunakan untuk kegiatan fakultas.')
        ->where('reservation.ditolak_pada', $rejectedAt->setTimezone('Asia/Jakarta')->format('d M Y, H:i'))
    );
});
