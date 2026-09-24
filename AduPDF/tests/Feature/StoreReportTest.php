<?php

use App\Enums\ReportStatus;
use App\Models\Facility;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('Pengguna can view the report form without legacy account approval', function () {
    $this->withoutVite();
    $user = User::factory()->pending()->create();
    $facility = Facility::factory()->create(['name' => 'Laboratorium Komputer']);

    $response = $this->actingAs($user)->get(route('reports.create'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('reports/create')
        ->has('facilities', 1)
        ->where('facilities.0.id', $facility->id)
        ->where('facilities.0.name', 'Laboratorium Komputer')
    );
});

test('guests are redirected to login when creating a report', function () {
    $response = $this->post(route('reports.store'));

    $response->assertRedirect(route('login'));
});

test('Petugas cannot create a report', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->post(route('reports.store'));

    $response->assertForbidden();
});

test('Pengguna can create a damage report with supporting photos without legacy account approval', function () {
    Storage::fake('local');
    $user = User::factory()->pending()->create();
    $facility = Facility::factory()->create();

    $response = $this->actingAs($user)->post(route('reports.store'), [
        'facility_id' => $facility->id,
        'kategori' => 'Kerusakan perangkat',
        'deskripsi' => 'Proyektor tidak dapat menyala.',
        'attachments' => [
            UploadedFile::fake()->create('proyektor.jpg', 100, 'image/jpeg'),
            UploadedFile::fake()->create('kabel.png', 100, 'image/png'),
        ],
    ]);

    $response->assertRedirect(route('reports.create'));
    $response->assertSessionHas('success', 'Laporan kerusakan berhasil dikirim.');
    $this->assertDatabaseHas('reports', [
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'kategori' => 'Kerusakan perangkat',
        'deskripsi' => 'Proyektor tidak dapat menyala.',
        'status_laporan' => ReportStatus::New->value,
    ]);

    $report = Report::query()->sole();
    expect($report->attachments)->toHaveCount(2);

    $report->attachments->each(fn ($attachment) => Storage::disk('local')->assertExists($attachment->file_path));
});

test('a report requires its facility, category, description, and supporting photo', function () {
    $user = User::factory()->pengguna()->create();

    $response = $this->actingAs($user)->post(route('reports.store'));

    $response->assertSessionHasErrors([
        'facility_id' => 'The facility id field is required.',
        'kategori' => 'The kategori field is required.',
        'deskripsi' => 'The deskripsi field is required.',
        'attachments' => 'Lampirkan minimal satu foto pendukung.',
    ]);
});

test('a report rejects more than eight supporting photos', function () {
    $user = User::factory()->pengguna()->create();
    $facility = Facility::factory()->create();

    $response = $this->actingAs($user)->post(route('reports.store'), [
        'facility_id' => $facility->id,
        'kategori' => 'Kerusakan perangkat',
        'deskripsi' => 'Proyektor tidak dapat menyala.',
        'attachments' => collect(range(1, 9))
            ->map(fn (int $number): UploadedFile => UploadedFile::fake()->create("foto-{$number}.jpg", 100, 'image/jpeg'))
            ->all(),
    ]);

    $response->assertSessionHasErrors([
        'attachments' => 'Satu laporan dapat memiliki maksimal 8 foto.',
    ]);
});

test('a report rejects oversized and unsupported supporting photos', function () {
    $user = User::factory()->pengguna()->create();
    $facility = Facility::factory()->create();

    $response = $this->actingAs($user)->post(route('reports.store'), [
        'facility_id' => $facility->id,
        'kategori' => 'Kerusakan perangkat',
        'deskripsi' => 'Proyektor tidak dapat menyala.',
        'attachments' => [
            UploadedFile::fake()->create('terlalu-besar.jpg', 2049, 'image/jpeg'),
            UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf'),
        ],
    ]);

    $response->assertSessionHasErrors([
        'attachments.0' => 'Ukuran setiap foto maksimal 2 MB.',
        'attachments.1' => 'Setiap lampiran harus berupa gambar.',
    ]);
});
