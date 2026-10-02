<?php

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Enums\ReportStatus;
use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Report;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to login when accessing admin recap (DA-03, RBAC)', function () {
    $response = $this->get(route('admin.recap.index'));

    $response->assertRedirect(route('login'));
});

test('pengguna cannot access admin recap (DA-03, RBAC)', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('admin.recap.index'));

    $response->assertForbidden();
});

test('petugas cannot access admin recap (DA-03, RBAC)', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->get(route('admin.recap.index'));

    $response->assertForbidden();
});

test('admin can access recap page with empty state (DA-03, FR-19)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.recap.index'));

    $response->assertOk();
    $response->assertSeeText('Rekapitulasi Okupansi & Kerusakan');
    $response->assertSee('Aturan BR-21 Terverifikasi');
});

test('full-room reservation counts as room usage only and does not count as tool usage (DA-03, FR-19, BR-21)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    // Setup Parent Room & Child Tool
    $room = Facility::factory()->create([
        'name' => 'Laboratorium Jaringan Komputer',
        'type' => FacilityType::Laboratory,
        'location' => 'Gedung C Lantai 2',
        'capacity' => 40,
        'condition' => FacilityCondition::Active,
    ]);

    $tool = Facility::factory()->create([
        'name' => 'MikroTik Router RB750',
        'type' => FacilityType::Equipment,
        'parent_facility_id' => $room->id,
        'location' => 'Gedung C Lantai 2',
        'capacity' => 1,
        'condition' => FacilityCondition::Active,
    ]);

    // 1. Create approved reservation for Room only
    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $room->id,
        'tujuan' => 'Praktikum Jaringan Komputer',
        'start_time' => now()->startOfMonth()->addDays(2)->setTime(8, 0, 0),
        'end_time' => now()->startOfMonth()->addDays(2)->setTime(10, 0, 0),
        'status' => ReservationStatus::Approved,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.recap.index', ['period' => 'this_month']));

    $response->assertOk();

    // Verify room usage count = 1 and tool usage count = 0
    $facilities = $response->viewData('facilities');
    $roomRecap = collect($facilities)->firstWhere('id', $room->id);
    $toolRecap = collect($facilities)->firstWhere('id', $tool->id);

    expect($roomRecap['usage_count'])->toBe(1)
        ->and($roomRecap['usage_hours'])->toBe(2.0)
        ->and($toolRecap['usage_count'])->toBe(0)
        ->and($toolRecap['usage_hours'])->toBe(0.0);
});

test('individual tool usage is counted only from explicit tool reservation (DA-03, FR-19, BR-21)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    $room = Facility::factory()->create([
        'name' => 'Laboratorium Robotika',
        'type' => FacilityType::Laboratory,
        'location' => 'Gedung D Lt. 1',
        'capacity' => 30,
        'condition' => FacilityCondition::Active,
    ]);

    $tool = Facility::factory()->create([
        'name' => 'Arm Robot Dobot Magician',
        'type' => FacilityType::Equipment,
        'parent_facility_id' => $room->id,
        'location' => 'Gedung D Lt. 1',
        'capacity' => 1,
        'condition' => FacilityCondition::Active,
    ]);

    // Explicit Tool Reservation
    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $tool->id,
        'tujuan' => 'Riset Skripsi Robotika',
        'start_time' => now()->startOfMonth()->addDays(3)->setTime(13, 0, 0),
        'end_time' => now()->startOfMonth()->addDays(3)->setTime(16, 0, 0),
        'status' => ReservationStatus::Approved,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.recap.index', ['period' => 'this_month']));

    $response->assertOk();

    $facilities = $response->viewData('facilities');
    $roomRecap = collect($facilities)->firstWhere('id', $room->id);
    $toolRecap = collect($facilities)->firstWhere('id', $tool->id);

    // Tool has 1 usage (3 hours), and Room has 0 usage
    expect($toolRecap['usage_count'])->toBe(1)
        ->and($toolRecap['usage_hours'])->toBe(3.0)
        ->and($roomRecap['usage_count'])->toBe(0)
        ->and($roomRecap['usage_hours'])->toBe(0.0);
});

test('recap presents damage frequency per facility and per location (DA-03, FR-19)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    $facilityGedungA = Facility::factory()->create([
        'name' => 'Ruang 101',
        'type' => FacilityType::Classroom,
        'location' => 'Gedung Kuliah A',
    ]);

    $facilityGedungB = Facility::factory()->create([
        'name' => 'Aula Gedung B',
        'type' => FacilityType::Hall,
        'location' => 'Gedung Kuliah B',
    ]);

    Report::factory()->create([
        'user_id' => $user->id,
        'facility_id' => $facilityGedungA->id,
        'kategori' => 'AC',
        'deskripsi' => 'AC mati di Ruang 101',
        'status_laporan' => ReportStatus::New,
    ]);

    Report::factory()->create([
        'user_id' => $user->id,
        'facility_id' => $facilityGedungA->id,
        'kategori' => 'Kelistrikan',
        'deskripsi' => 'Stop kontak rusak',
        'status_laporan' => ReportStatus::Completed,
    ]);

    Report::factory()->create([
        'user_id' => $user->id,
        'facility_id' => $facilityGedungB->id,
        'kategori' => 'Lampu',
        'deskripsi' => 'Lampu panggung padam',
        'status_laporan' => ReportStatus::Processing,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.recap.index', ['period' => 'this_month']));

    $response->assertOk();
    $response->assertSee('Ruang 101');
    $response->assertSee('Gedung Kuliah A');
    $response->assertSee('Aula Gedung B');
    $response->assertSee('Gedung Kuliah B');

    $damageByFacility = $response->viewData('damage_by_facility');
    $damageByLocation = $response->viewData('damage_by_location');

    $facilityAStat = collect($damageByFacility)->firstWhere('id', $facilityGedungA->id);
    expect($facilityAStat['report_count'])->toBe(2);

    $locAStat = collect($damageByLocation)->firstWhere('location', 'Gedung Kuliah A');
    $locBStat = collect($damageByLocation)->firstWhere('location', 'Gedung Kuliah B');
    expect($locAStat['total_reports'])->toBe(2)
        ->and($locBStat['total_reports'])->toBe(1);
});

test('admin can export recap to CSV (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();
    $facility = Facility::factory()->create([
        'name' => 'Ruang Teater',
        'type' => FacilityType::Hall,
        'location' => 'Gedung Rektorat Lt. 3',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.recap.export', ['format' => 'csv']));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

    $content = $response->streamedContent();
    expect($content)->toContain('REKAPITULASI OKUPANSI & KERUSAKAN FASILITAS')
        ->and($content)->toContain('BR-21')
        ->and($content)->toContain('Ruang Teater')
        ->and($content)->toContain('Gedung Rektorat Lt. 3');
});

test('unsupported export format returns informative error message (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.recap.export', ['format' => 'xml']));

    $response->assertSessionHas('error');
    $error = session('error');
    expect($error)->toContain('XML')
        ->and($error)->toContain('CSV');
});
