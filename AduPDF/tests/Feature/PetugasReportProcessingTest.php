<?php

use App\Enums\FacilityCondition;
use App\Enums\ReportStatus;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('Petugas can view the queue of new reports only', function () {
    $this->withoutVite();
    $petugas = User::factory()->petugas()->create();
    $newReport = Report::factory()->create(['status_laporan' => ReportStatus::New]);
    Report::factory()->create(['status_laporan' => ReportStatus::Processing]);

    $response = $this->actingAs($petugas)->get(route('petugas.reports.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/reports/index')
        ->has('reports', 1)
        ->where('reports.0.id', $newReport->id)
    );
});

test('Petugas can view report details separately from facility condition', function () {
    $this->withoutVite();
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()
        ->has(ReportAttachment::factory()->count(2), 'attachments')
        ->create(['status_laporan' => ReportStatus::Processing]);
    $report->facility->update(['condition' => FacilityCondition::UnderRepair]);

    $response = $this->actingAs($petugas)->get(route('petugas.reports.show', $report));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('petugas/reports/show')
        ->where('report.status_laporan', 'diproses')
        ->where('report.facility.condition', 'dalam_perbaikan')
        ->has('report.attachments', 2)
    );
});

test('Petugas can move a new report to processing', function () {
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::New]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.update', $report), [
        'status_laporan' => ReportStatus::Processing->value,
    ]);

    $response->assertRedirect(route('petugas.reports.show', $report));
    $response->assertSessionHas('success', 'Status laporan berhasil diperbarui.');
    $this->assertDatabaseHas('reports', [
        'id' => $report->id,
        'status_laporan' => ReportStatus::Processing->value,
        'catatan_resolusi' => null,
    ]);
});

test('Petugas must provide a resolution note when closing a report', function () {
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::Processing]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.update', $report), [
        'status_laporan' => ReportStatus::Completed->value,
    ]);

    $response->assertSessionHasErrors([
        'catatan_resolusi' => 'Catatan resolusi wajib diisi ketika laporan ditutup.',
    ]);
    $this->assertDatabaseHas('reports', [
        'id' => $report->id,
        'status_laporan' => ReportStatus::Processing->value,
    ]);
});

test('Petugas can close a processing report with a resolution note', function () {
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::Processing]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.update', $report), [
        'status_laporan' => ReportStatus::Completed->value,
        'catatan_resolusi' => 'Proyektor telah diperbaiki dan diuji.',
    ]);

    $response->assertRedirect(route('petugas.reports.show', $report));
    $this->assertDatabaseHas('reports', [
        'id' => $report->id,
        'status_laporan' => ReportStatus::Completed->value,
        'catatan_resolusi' => 'Proyektor telah diperbaiki dan diuji.',
    ]);
});

test('Petugas cannot change a closed report', function () {
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::Rejected]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.update', $report), [
        'status_laporan' => ReportStatus::Processing->value,
        'catatan_resolusi' => 'Mencoba membuka ulang laporan.',
    ]);

    $response->assertSessionHasErrors([
        'status_laporan' => 'Status laporan tidak dapat diubah dari status saat ini.',
    ]);
});

test('Pengguna cannot process reports', function () {
    $user = User::factory()->pengguna()->create();
    $report = Report::factory()->create();

    $response = $this->actingAs($user)->patch(route('petugas.reports.update', $report), [
        'status_laporan' => ReportStatus::Processing->value,
    ]);

    $response->assertForbidden();
});
