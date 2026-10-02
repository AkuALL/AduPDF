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

test('admin can export recap to Excel with worksheets, styling, and BR-21 note (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();
    Facility::factory()->create([
        'name' => 'Auditorium Utama',
        'type' => FacilityType::Hall,
        'location' => 'Gedung Pusat Lt. 1',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.recap.export', ['format' => 'excel']));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/vnd.ms-excel; charset=UTF-8');

    $content = $response->streamedContent();
    expect($content)->toContain('<?xml version="1.0" encoding="UTF-8"?>')
        ->and($content)->toContain('Worksheet ss:Name="Okupansi Fasilitas"')
        ->and($content)->toContain('Worksheet ss:Name="Kerusakan per Fasilitas"')
        ->and($content)->toContain('Worksheet ss:Name="Kerusakan per Lokasi"')
        ->and($content)->toContain('Aturan BR-21')
        ->and($content)->toContain('Auditorium Utama');
});

test('admin can export recap to PDF with valid PDF binary format (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();
    Facility::factory()->create([
        'name' => 'Ruang Rapat Senat',
        'type' => FacilityType::Hall,
        'location' => 'Gedung Rektorat Lt. 2',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.recap.export', ['format' => 'pdf']));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/pdf');

    $content = $response->streamedContent();
    expect(str_starts_with($content, '%PDF-1.4'))->toBeTrue()
        ->and(str_contains($content, '%%EOF'))->toBeTrue()
        ->and($content)->toContain('ADUPDF')
        ->and($content)->toContain('Ruang Rapat Senat');
});

test('export respects filters like facility_type and location (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();

    $matchingFacility = Facility::factory()->create([
        'name' => 'Lab Software Engineering',
        'type' => FacilityType::Laboratory,
        'location' => 'Gedung FST Lt. 3',
    ]);

    $nonMatchingFacility = Facility::factory()->create([
        'name' => 'Lapangan Basket',
        'type' => FacilityType::Field,
        'location' => 'Area Olahraga Barat',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.recap.export', [
        'format' => 'csv',
        'facility_type' => FacilityType::Laboratory->value,
        'location' => 'Gedung FST',
    ]));

    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain('Lab Software Engineering')
        ->and($content)->not->toContain('Lapangan Basket');
});

test('export handles empty data cleanly in CSV, Excel, and PDF (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();

    // 1. CSV empty data
    $csvResponse = $this->actingAs($admin)->get(route('admin.recap.export', [
        'format' => 'csv',
        'search' => 'FasilitasYangPastiTidakAda123',
    ]));
    $csvResponse->assertOk();
    $csvContent = $csvResponse->streamedContent();
    expect($csvContent)->toContain('Tidak ada data fasilitas yang sesuai dengan filter yang dipilih.')
        ->and($csvContent)->toContain('Tidak ada data laporan kerusakan untuk periode ini.');

    // 2. Excel empty data
    $excelResponse = $this->actingAs($admin)->get(route('admin.recap.export', [
        'format' => 'excel',
        'search' => 'FasilitasYangPastiTidakAda123',
    ]));
    $excelResponse->assertOk();
    $excelContent = $excelResponse->streamedContent();
    expect($excelContent)->toContain('Tidak ada data fasilitas yang sesuai dengan filter yang dipilih.')
        ->and($excelContent)->toContain('Worksheet ss:Name="Okupansi Fasilitas"');

    // 3. PDF empty data
    $pdfResponse = $this->actingAs($admin)->get(route('admin.recap.export', [
        'format' => 'pdf',
        'search' => 'FasilitasYangPastiTidakAda123',
    ]));
    $pdfResponse->assertOk();
    $pdfContent = $pdfResponse->streamedContent();
    expect(str_starts_with($pdfContent, '%PDF-1.4'))->toBeTrue()
        ->and($pdfContent)->toContain('Tidak ada data fasilitas yang sesuai');
});

test('generation error is caught and returns informative message without mutating database (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();

    $initialCount = Facility::count();

    $response = $this->actingAs($admin)->get(route('admin.recap.export', [
        'format' => 'csv',
        'simulate_error' => 1,
    ]));

    $response->assertSessionHas('error');
    $error = session('error');
    expect($error)->toContain('Terjadi kesalahan saat membuat berkas ekspor CSV')
        ->and($error)->toContain('Data sistem tetap aman.')
        ->and(Facility::count())->toBe($initialCount);
});

test('unsupported export format returns informative error message (DA-04, FR-19)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.recap.export', ['format' => 'word']));

    $response->assertSessionHas('error');
    $error = session('error');
    expect($error)->toContain('WORD')
        ->and($error)->toContain('CSV, Excel, atau PDF');
});

test('unauthorized users cannot export recap (DA-04, RBAC)', function () {
    $pengguna = User::factory()->pengguna()->create();
    $petugas = User::factory()->petugas()->create();

    // Guest redirected to login
    $this->get(route('admin.recap.export', ['format' => 'csv']))
        ->assertRedirect(route('login'));

    // Pengguna forbidden
    $this->actingAs($pengguna)
        ->get(route('admin.recap.export', ['format' => 'csv']))
        ->assertForbidden();

    // Petugas forbidden
    $this->actingAs($petugas)
        ->get(route('admin.recap.export', ['format' => 'csv']))
        ->assertForbidden();
});
