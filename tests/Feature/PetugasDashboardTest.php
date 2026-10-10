<?php

use App\Enums\FacilityCondition;
use App\Enums\ReportStatus;
use App\Enums\ReservationStatus;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Facility;
use App\Models\Report;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

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

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/dashboard')
        ->where('pending_reservations_count', 0)
        ->where('new_reports_count', 0)
        ->where('reservation_segments', [])
        ->where('reports', [])
    );
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

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/dashboard')
        ->has('reservation_segments', 2)
        ->where('reservation_segments.0.reservations.0.facility_name', 'Lab Software Engineering')
        ->where('reservation_segments.0.reservations.0.tujuan', 'Praktikum Pemrograman Web Lanjut')
        ->where('reservation_segments.0.reservations.1.facility_name', 'Aula Nusantara')
        ->where('reservation_segments.0.reservations.1.tujuan', 'Rapat Koordinasi Himpunan Mahasiswa')
        ->where('reservation_segments.1.reservations.0.tujuan', 'Workshop UI/UX Design')
    );
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

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/dashboard')
        ->has('reports', 1)
        ->where('reports.0.deskripsi', 'Stop kontak meja 5 mengeluarkan percikan api')
        ->where('reports.0.reporter_name', 'Pelapor Kerusakan')
        ->where('reports.0.kategori', 'Kelistrikan')
        ->where('new_reports_count', 1)
    );
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

    $response = $this->actingAs($petugas)->patch(route('petugas.reservations.reject', $reservation), [
        'alasan_penolakan' => 'Kegiatan belum mendapatkan izin dekanat.',
    ]);

    $response->assertRedirect(route('petugas.reservations.index'));
    $response->assertSessionHas('success');
    $reservation->refresh();
    expect($reservation->status)->toBe(ReservationStatus::Rejected)
        ->and($reservation->alasan_penolakan)->toBe('Kegiatan belum mendapatkan izin dekanat.')
        ->and($reservation->ditolak_pada)->not->toBeNull();
});

test('dashboard route redirects petugas to petugas dashboard (DA-02)', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->get(route('dashboard'));

    $response->assertRedirect(route('petugas.dashboard'));
});

test('petugas dashboard displays 4 operational metrics, today agenda, and under repair facilities (DA-02, FR-09)', function () {
    $petugas = User::factory()->petugas()->create();
    $user = User::factory()->pengguna()->create(['nama' => 'Dosen Pembimbing']);

    $roomActive = Facility::factory()->create(['name' => 'Ruang Seminar Utama', 'location' => 'Gedung C Lt. 3', 'condition' => FacilityCondition::Active]);
    $roomBroken = Facility::factory()->create(['name' => 'Lab Multimedia Rusak', 'location' => 'Gedung D Lt. 1', 'condition' => FacilityCondition::UnderRepair]);

    // Today approved reservation
    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $roomActive->id,
        'tujuan' => 'Sidang Skripsi Terbuka Hari Ini',
        'start_time' => now()->setTime(10, 0, 0),
        'end_time' => now()->setTime(12, 0, 0),
        'status' => ReservationStatus::Approved,
    ]);

    // Tomorrow approved reservation (should not be in today agenda)
    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $roomActive->id,
        'tujuan' => 'Kuliah Tamu Besok Pagi',
        'start_time' => now()->addDay()->setTime(9, 0, 0),
        'end_time' => now()->addDay()->setTime(11, 0, 0),
        'status' => ReservationStatus::Approved,
    ]);

    // Pending reservation
    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $roomActive->id,
        'tujuan' => 'Rapat Senat Akademik',
        'start_time' => now()->addDays(2)->setTime(13, 0, 0),
        'end_time' => now()->addDays(2)->setTime(15, 0, 0),
        'status' => ReservationStatus::Pending,
    ]);

    // New report
    Report::factory()->create([
        'user_id' => $user->id,
        'facility_id' => $roomBroken->id,
        'kategori' => 'Kelistrikan',
        'deskripsi' => 'Konsleting panel listrik',
        'status_laporan' => ReportStatus::New,
    ]);

    $response = $this->actingAs($petugas)->get(route('petugas.dashboard'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/dashboard')
        ->where('today_reservations_count', 1)
        ->where('today_reservations.0.tujuan', 'Sidang Skripsi Terbuka Hari Ini')
        ->where('today_reservations.0.facility_name', 'Ruang Seminar Utama')
        ->where('under_repair_facilities_count', 1)
        ->where('under_repair_facilities.0.name', 'Lab Multimedia Rusak')
        ->where('pending_reservations_count', 1)
        ->where('reservation_segments.0.reservations.0.tujuan', 'Rapat Senat Akademik')
        ->where('new_reports_count', 1)
        ->where('reports.0.deskripsi', 'Konsleting panel listrik')
    );
});

test('petugas dashboard inertia response returns complete operational props (DA-02, FR-09)', function () {
    $petugas = User::factory()->petugas()->create();
    $facility = Facility::factory()->create(['name' => 'Aula Garuda', 'condition' => FacilityCondition::UnderRepair]);
    $user = User::factory()->pengguna()->create(['nama' => 'Koor Panitia']);

    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Gladi Resik Yudisium',
        'start_time' => now()->setTime(14, 0, 0),
        'end_time' => now()->setTime(16, 0, 0),
        'status' => ReservationStatus::Approved,
    ]);

    $version = app(HandleInertiaRequests::class)->version(request());

    $response = $this->actingAs($petugas)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
        ])
        ->get(route('petugas.dashboard'));

    $response->assertOk();
    $response->assertJsonPath('component', 'petugas/dashboard');
    $response->assertJsonPath('props.today_reservations_count', 1);
    $response->assertJsonPath('props.under_repair_facilities_count', 1);
    $response->assertJsonPath('props.today_reservations.0.tujuan', 'Gladi Resik Yudisium');
    $response->assertJsonPath('props.under_repair_facilities.0.name', 'Aula Garuda');
});
