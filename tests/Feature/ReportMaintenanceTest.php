<?php

use App\Enums\FacilityCondition;
use App\Enums\ReportStatus;
use App\Models\Report;
use App\Models\User;

test('Petugas can mark a facility under repair through a processing report', function () {
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::Processing]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.facility-condition.update', $report), [
        'condition' => FacilityCondition::UnderRepair->value,
    ]);

    $response->assertRedirect(route('petugas.reports.show', $report));
    $response->assertSessionHas('success', 'Kondisi fasilitas berhasil diperbarui.');
    $this->assertDatabaseHas('facilities', [
        'id' => $report->facility_id,
        'condition' => FacilityCondition::UnderRepair->value,
    ]);
});

test('Petugas cannot mark a facility under repair before its report is processed', function () {
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::New]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.facility-condition.update', $report), [
        'condition' => FacilityCondition::UnderRepair->value,
    ]);

    $response->assertSessionHasErrors([
        'condition' => 'Fasilitas hanya dapat ditandai dalam perbaikan saat laporan diproses.',
    ]);
});

test('Petugas can restore a repaired facility after the report is completed', function () {
    $petugas = User::factory()->petugas()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::Completed]);
    $report->facility->update(['condition' => FacilityCondition::UnderRepair]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.facility-condition.update', $report), [
        'condition' => FacilityCondition::Active->value,
    ]);

    $response->assertRedirect(route('petugas.reports.show', $report));
    $this->assertDatabaseHas('facilities', [
        'id' => $report->facility_id,
        'condition' => FacilityCondition::Active->value,
    ]);
});

test('Petugas cannot restore a facility while another report remains open', function () {
    $petugas = User::factory()->petugas()->create();
    $completedReport = Report::factory()->create(['status_laporan' => ReportStatus::Completed]);
    $completedReport->facility->update(['condition' => FacilityCondition::UnderRepair]);
    Report::factory()->for($completedReport->facility)->create(['status_laporan' => ReportStatus::Processing]);

    $response = $this->actingAs($petugas)->patch(route('petugas.reports.facility-condition.update', $completedReport), [
        'condition' => FacilityCondition::Active->value,
    ]);

    $response->assertSessionHasErrors([
        'condition' => 'Fasilitas masih memiliki laporan lain yang belum ditutup.',
    ]);
    $this->assertDatabaseHas('facilities', [
        'id' => $completedReport->facility_id,
        'condition' => FacilityCondition::UnderRepair->value,
    ]);
});

test('Pengguna cannot change facility condition through a report', function () {
    $user = User::factory()->pengguna()->create();
    $report = Report::factory()->create(['status_laporan' => ReportStatus::Processing]);

    $response = $this->actingAs($user)->patch(route('petugas.reports.facility-condition.update', $report), [
        'condition' => FacilityCondition::UnderRepair->value,
    ]);

    $response->assertForbidden();
});
