<?php

use App\Enums\FacilityCondition;
use App\Enums\ReportStatus;
use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Report;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to login when visiting petugas dashboard (DA-02, RBAC)', function () {
    $response = $this->get(route('petugas.dashboard'));

    $response->assertRedirect(route('login'));
});

test('pengguna cannot access petugas dashboard (DA-02, RBAC)', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('petugas.dashboard'));

    $response->assertForbidden();
});

test('admin cannot access petugas dashboard (DA-02, RBAC)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('petugas.dashboard'));

    $response->assertForbidden();
});

test('petugas can visit operational dashboard with empty state (DA-02, FR-09)', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->get(route('petugas.dashboard'));

    $response->assertOk();
    $response->assertSee('Dashboard Antrean Petugas');
    $response->assertSee('Tidak Ada Antrean Reservasi');
    $response->assertSee('Tidak Ada Laporan Baru');
});

test('petugas dashboard segments reservation queue by time slot and orders FIFO within segments (DA-02, FR-09, BR-25)', function () {
    $petugas = User::factory()->petugas()->create();
    $facilityA = Facility::factory()->create(['name' => 'Lab Software Engineering', 'location' => 'Gedung A Lt. 2']);
    $facilityB = Facility::factory()->create(['name' => 'Aula Nusantara', 'location' => 'Gedung B Lt. 1']);

    $user1 = User::factory()->pengguna()->create(['nama' => 'Ahmad Pemesan']);
    $user2 = User::factory()->pengguna()->create(['nama' => 'Budi Pemesan']);
    $user3 = User::factory()->pengguna()->create(['nama' => 'Citra Pemesan']);

    $earlierSlotStart = now()->addDays(2)->setTime(8, 0, 0);
    $earlierSlotEnd = now()->addDays(2)->setTime(10, 0, 0);

    $laterSlotStart = now()->addDays(2)->setTime(13, 0, 0);
    $laterSlotEnd = now()->addDays(2)->setTime(15, 0, 0);

    // Slot 1 (earlier): First submitted (2 hours ago)
    $resSlot1Earlier = Reservation::create([
        'user_id' => $user1->id,
        'facility_id' => $facilityA->id,
        'tujuan' => 'Praktikum Pemrograman Web Lanjut',
        'start_time' => $earlierSlotStart,
        'end_time' => $earlierSlotEnd,
        'status' => ReservationStatus::Pending,
        'created_at' => now()->subHours(2),
    ]);

    // Slot 1 (earlier): Second submitted (1 hour ago)
    $resSlot1Later = Reservation::create([
        'user_id' => $user2->id,
        'facility_id' => $facilityB->id,
        'tujuan' => 'Rapat Koordinasi Himpunan Mahasiswa',
        'start_time' => $earlierSlotStart,
        'end_time' => $earlierSlotEnd,
        'status' => ReservationStatus::Pending,
        'created_at' => now()->subHours(1),
    ]);

    // Slot 2 (later slot): Third reservation
    $resSlot2 = Reservation::create([
        'user_id' => $user3->id,
        'facility_id' => $facilityA->id,
        'tujuan' => 'Workshop UI/UX Design',
        'start_time' => $laterSlotStart,
        'end_time' => $laterSlotEnd,
        'status' => ReservationStatus::Pending,
        'created_at' => now()->subMinutes(30),
    ]);

    $response = $this->actingAs($petugas)->get(route('petugas.dashboard'));

    $response->assertOk();
    $content = $response->getContent();

    // Verify both facilities and purposes appear
    $response->assertSee('Lab Software Engineering');
    $response->assertSee('Aula Nusantara');
    $response->assertSee('Praktikum Pemrograman Web Lanjut');
    $response->assertSee('Rapat Koordinasi Himpunan Mahasiswa');
    $response->assertSee('Workshop UI/UX Design');

    // Verify ordering:
    // Slot 1 (08:00) should appear before Slot 2 (13:00)
    $posSlot1Res1 = strpos($content, 'Praktikum Pemrograman Web Lanjut');
    $posSlot1Res2 = strpos($content, 'Rapat Koordinasi Himpunan Mahasiswa');
    $posSlot2Res3 = strpos($content, 'Workshop UI/UX Design');

    expect($posSlot1Res1)->toBeLessThan($posSlot1Res2)
        ->and($posSlot1Res2)->toBeLessThan($posSlot2Res3);
});

test('petugas dashboard only displays new reports and ignores non-new ones (DA-02, FR-09, BR-13)', function () {
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create(['name' => 'Lab Jaringan', 'condition' => FacilityCondition::Active]);
    $reporter = User::factory()->pengguna()->create(['nama' => 'Pelapor Kerusakan']);

    $newReport = Report::factory()->create([
        'user_id' => $reporter->id,
        'facility_id' => $facility->id,
        'kategori' => 'Kelistrikan',
        'deskripsi' => 'Stop kontak meja 5 mengeluarkan percikan api',
        'status_laporan' => ReportStatus::New,
    ]);

    $processingReport = Report::factory()->create([
        'user_id' => $reporter->id,
        'facility_id' => $facility->id,
        'kategori' => 'AC',
        'deskripsi' => 'AC bocor menetes ke lantai',
        'status_laporan' => ReportStatus::Processing,
    ]);

    $completedReport = Report::factory()->create([
        'user_id' => $reporter->id,
        'facility_id' => $facility->id,
        'kategori' => 'Lampu',
        'deskripsi' => 'Lampu ruangan padam',
        'status_laporan' => ReportStatus::Completed,
    ]);

    $response = $this->actingAs($petugas)->get(route('petugas.dashboard'));

    $response->assertOk();
    $response->assertSee('Stop kontak meja 5 mengeluarkan percikan api');
    $response->assertSee('Pelapor Kerusakan');
    $response->assertSee('Kelistrikan');

    // Should NOT see processing or completed reports in the new reports queue
    $response->assertDontSee('AC bocor menetes ke lantai');
    $response->assertDontSee('Lampu ruangan padam');
});

test('petugas can approve a pending reservation directly from the dashboard (DA-02, FR-10)', function () {
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create(['condition' => FacilityCondition::Active]);
    $user = User::factory()->pengguna()->create();

    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Ujian Akhir Semester',
        'start_time' => now()->addDays(3)->setTime(9, 0, 0),
        'end_time' => now()->addDays(3)->setTime(11, 0, 0),
        'status' => ReservationStatus::Pending,
    ]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.approve', $reservation));

    $response->assertRedirect(route('petugas.reservations.index'));
    $response->assertSessionHas('success');
    expect($reservation->refresh()->status)->toBe(ReservationStatus::Approved);
});

test('petugas can reject a pending reservation directly from the dashboard (DA-02, FR-10)', function () {
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create(['condition' => FacilityCondition::Active]);
    $user = User::factory()->pengguna()->create();

    $reservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kegiatan Tanpa Izin Dekanat',
        'start_time' => now()->addDays(4)->setTime(14, 0, 0),
        'end_time' => now()->addDays(4)->setTime(16, 0, 0),
        'status' => ReservationStatus::Pending,
    ]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.reject', $reservation));

    $response->assertRedirect(route('petugas.reservations.index'));
    $response->assertSessionHas('success');
    expect($reservation->refresh()->status)->toBe(ReservationStatus::Rejected);
});

test('dashboard route redirects petugas to petugas dashboard (DA-02)', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->get(route('dashboard'));

    $response->assertRedirect(route('petugas.dashboard'));
});
