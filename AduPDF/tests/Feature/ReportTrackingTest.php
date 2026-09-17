<?php

use App\Enums\ReportStatus;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('approved Pengguna can view only their reports', function () {
    $this->withoutVite();
    $user = User::factory()->pengguna()->create();
    $ownReport = Report::factory()->for($user)->create([
        'kategori' => 'Perangkat rusak',
        'status_laporan' => ReportStatus::Processing,
    ]);
    Report::factory()->create(['kategori' => 'Laporan pengguna lain']);

    $response = $this->actingAs($user)->get(route('reports.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('reports/index')
        ->has('reports', 1)
        ->where('reports.0.id', $ownReport->id)
        ->where('reports.0.kategori', 'Perangkat rusak')
        ->where('reports.0.status_laporan', 'diproses')
    );
});

test('approved Pengguna can view their report detail', function () {
    $this->withoutVite();
    $user = User::factory()->pengguna()->create();
    $report = Report::factory()
        ->for($user)
        ->has(ReportAttachment::factory()->count(2), 'attachments')
        ->create([
            'status_laporan' => ReportStatus::Completed,
            'catatan_resolusi' => 'Proyektor telah diperbaiki.',
        ]);

    $response = $this->actingAs($user)->get(route('reports.show', $report));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('reports/show')
        ->where('report.id', $report->id)
        ->where('report.status_laporan', 'selesai')
        ->where('report.catatan_resolusi', 'Proyektor telah diperbaiki.')
        ->has('report.attachments', 2)
    );
});

test('Pengguna cannot view another users report', function () {
    $user = User::factory()->pengguna()->create();
    $otherReport = Report::factory()->create();

    $response = $this->actingAs($user)->get(route('reports.show', $otherReport));

    $response->assertForbidden();
});

test('guests are redirected to login when viewing reports', function () {
    $response = $this->get(route('reports.index'));

    $response->assertRedirect(route('login'));
});

test('Petugas cannot view Pengguna reports', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->get(route('reports.index'));

    $response->assertForbidden();
});
