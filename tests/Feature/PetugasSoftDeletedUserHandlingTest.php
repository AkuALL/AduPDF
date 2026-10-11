<?php

use App\Enums\ReportStatus;
use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Report;
use App\Models\Reservation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('petugas can view reservations queue with soft-deleted users without errors', function () {
    $this->withoutVite();
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create();

    $user = User::factory()->create(['nama' => 'Budi Santoso']);
    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan praktikum mandiri',
        'status' => ReservationStatus::Pending,
        'start_time' => now()->addDays(2)->setTime(9, 0),
        'end_time' => now()->addDays(2)->setTime(11, 0),
    ]);

    // Soft delete the user (e.g. deactivated by admin)
    $user->delete();
    expect($user->fresh()->trashed())->toBeTrue();

    $response = $this->actingAs($petugas)->get(route('petugas.reservations.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/reservations/index')
        ->has('reservations', 1)
        ->where('reservations.0.id', $reservation->id)
        ->where('reservations.0.user', 'Budi Santoso (Nonaktif)')
    );
});

test('petugas can view approved reservations with soft-deleted users without errors', function () {
    $this->withoutVite();
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create();

    $user = User::factory()->create(['nama' => 'Siti Rahma']);
    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Rapat kerja himpunan',
        'status' => ReservationStatus::Approved,
        'start_time' => now()->addDays(3)->setTime(10, 0),
        'end_time' => now()->addDays(3)->setTime(12, 0),
    ]);

    $user->delete();

    $response = $this->actingAs($petugas)->get(route('petugas.reservations.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/reservations/index')
        ->has('approved_reservations', 1)
        ->where('approved_reservations.0.id', $reservation->id)
        ->where('approved_reservations.0.user', 'Siti Rahma (Nonaktif)')
    );
});

test('petugas can view reports queue and report details with soft-deleted reporter', function () {
    $this->withoutVite();
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create();

    $reporter = User::factory()->create(['nama' => 'Ahmad Fauzi']);
    $report = Report::factory()->create([
        'user_id' => $reporter->id,
        'facility_id' => $facility->id,
        'status_laporan' => ReportStatus::New,
    ]);

    $reporter->delete();

    // Check reports index queue
    $indexResponse = $this->actingAs($petugas)->get(route('petugas.reports.index'));
    $indexResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/reports/index')
        ->has('reports', 1)
        ->where('reports.0.id', $report->id)
        ->where('reports.0.reporter', 'Ahmad Fauzi (Nonaktif)')
    );

    // Check report details show
    $showResponse = $this->actingAs($petugas)->get(route('petugas.reports.show', $report));
    $showResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/reports/show')
        ->where('report.id', $report->id)
        ->where('report.reporter', 'Ahmad Fauzi (Nonaktif)')
    );
});

test('petugas dashboard displays soft-deleted user names gracefully', function () {
    $this->withoutVite();
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create();

    $user = User::factory()->create(['nama' => 'Dewi Lestari']);
    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Seminar akademik',
        'status' => ReservationStatus::Pending,
        'start_time' => now()->addDays(1)->setTime(13, 0),
        'end_time' => now()->addDays(1)->setTime(15, 0),
    ]);

    $report = Report::factory()->create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'status_laporan' => ReportStatus::New,
    ]);

    $user->delete();

    $response = $this->actingAs($petugas)->get(route('petugas.dashboard'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/dashboard')
        ->where('reservation_segments.0.reservations.0.user_name', 'Dewi Lestari (Nonaktif)')
        ->where('reports.0.reporter_name', 'Dewi Lestari (Nonaktif)')
    );
});
