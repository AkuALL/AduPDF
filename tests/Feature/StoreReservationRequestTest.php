<?php

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Carbon\CarbonImmutable;

test('accepts reservation slots at the inclusive operating-hour boundaries', function (string $start, string $end) {
    $user = User::factory()->pengguna()->withInstitutionalIdentity()->create();
    $facility = Facility::factory()->create(['condition' => 'aktif']);
    $date = now('Asia/Jakarta')->addDays(2)->format('Y-m-d');

    $response = $this->actingAs($user)->post('/reservations', [
        'facility_id' => $facility->id,
        'start_time' => "{$date}T{$start}",
        'end_time' => "{$date}T{$end}",
        'tujuan' => 'Pengujian batas jam reservasi',
    ]);

    $response->assertRedirect(route('reservations.create', ['facility_id' => $facility->id]));
    expect(Reservation::query()->firstOrFail()->status)->toBe(ReservationStatus::Pending);
})->with([
    'starts at 07:00' => ['07:00', '07:30'],
    'ends at 20:00' => ['19:30', '20:00'],
]);

test('rejects slots outside operating hours and slots that do not use 30-minute boundaries', function (string $start, string $end) {
    $user = User::factory()->pengguna()->withInstitutionalIdentity()->create();
    $facility = Facility::factory()->create(['condition' => 'aktif']);
    $date = now('Asia/Jakarta')->addDays(2)->format('Y-m-d');

    $response = $this->actingAs($user)->from('/reservations/create')->post('/reservations', [
        'facility_id' => $facility->id,
        'start_time' => "{$date}T{$start}",
        'end_time' => "{$date}T{$end}",
        'tujuan' => 'Pengujian batas jam reservasi',
    ]);

    $response->assertSessionHasErrors([
        'start_time' => 'Pilih slot 30 menit pada hari yang sama antara 07:00 dan 20:00 WIB.',
    ]);
    expect(Reservation::query()->count())->toBe(0);
})->with([
    'before opening' => ['06:30', '07:00'],
    'after closing' => ['19:30', '20:30'],
    'off the half-hour' => ['08:15', '08:45'],
]);

test('accepts the exact 90-day horizon and rejects later reservation starts', function () {
    $now = CarbonImmutable::parse('2026-10-11 12:00:00', 'Asia/Jakarta');
    $this->travelTo($now);
    $user = User::factory()->pengguna()->withInstitutionalIdentity()->create();
    $facility = Facility::factory()->create(['condition' => 'aktif']);
    $boundary = $now->addDays(90);

    $accepted = $this->actingAs($user)->post('/reservations', [
        'facility_id' => $facility->id,
        'start_time' => $boundary->format('Y-m-d\\TH:i'),
        'end_time' => $boundary->addMinutes(30)->format('Y-m-d\\TH:i'),
        'tujuan' => 'Pengujian batas 90 hari',
    ]);

    $accepted->assertRedirect(route('reservations.create', ['facility_id' => $facility->id]));
    expect(Reservation::query()->count())->toBe(1);

    $afterBoundary = $boundary->addDays(1);
    $rejected = $this->from('/reservations/create')->post('/reservations', [
        'facility_id' => $facility->id,
        'start_time' => $afterBoundary->format('Y-m-d\\TH:i'),
        'end_time' => $afterBoundary->addMinutes(30)->format('Y-m-d\\TH:i'),
        'tujuan' => 'Pengujian batas 90 hari',
    ]);

    $rejected->assertSessionHasErrors([
        'start_time' => 'Reservasi hanya dapat diajukan maksimal 90 hari ke depan.',
    ]);
    expect(Reservation::query()->count())->toBe(1);
});

test('rejects reservation starts in the past', function () {
    $now = CarbonImmutable::parse('2026-10-11 12:00:00', 'Asia/Jakarta');
    $this->travelTo($now);
    $user = User::factory()->pengguna()->withInstitutionalIdentity()->create();
    $facility = Facility::factory()->create(['condition' => 'aktif']);
    $past = $now->subMinutes(30);

    $response = $this->actingAs($user)->from('/reservations/create')->post('/reservations', [
        'facility_id' => $facility->id,
        'start_time' => $past->format('Y-m-d\\TH:i'),
        'end_time' => $now->format('Y-m-d\\TH:i'),
        'tujuan' => 'Pengujian waktu lampau',
    ]);

    $response->assertSessionHasErrors([
        'start_time' => 'Waktu reservasi harus di masa depan dan waktu selesai harus setelah waktu mulai.',
    ]);
    expect(Reservation::query()->count())->toBe(0);
});
