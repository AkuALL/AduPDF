<?php

use App\Enums\ReportStatus;
use App\Models\Facility;
use App\Models\Report;
use App\Queries\DamageStatisticsQuery;
use App\Queries\ReportQueueQuery;

test('report queue contract returns new reports with their facility and reporter', function () {
    $newReport = Report::factory()->create(['status_laporan' => ReportStatus::New]);
    Report::factory()->create(['status_laporan' => ReportStatus::Processing]);

    $reports = app(ReportQueueQuery::class)->newReports()->get();

    expect($reports)->toHaveCount(1)
        ->and($reports->sole()->is($newReport))->toBeTrue()
        ->and($reports->sole()->relationLoaded('facility'))->toBeTrue()
        ->and($reports->sole()->relationLoaded('user'))->toBeTrue();
});

test('damage statistics contract groups report frequency by facility and location', function () {
    $laboratory = Facility::factory()->create(['name' => 'Laboratorium Komputer', 'location' => 'Gedung A']);
    $hall = Facility::factory()->create(['name' => 'Aula Utama', 'location' => 'Gedung B']);
    Report::factory()->count(3)->for($laboratory)->create();
    Report::factory()->for($hall)->create();

    $statistics = app(DamageStatisticsQuery::class)->byFacility();

    expect($statistics)->toHaveCount(2)
        ->and($statistics->first()->name)->toBe('Laboratorium Komputer')
        ->and((int) $statistics->first()->report_count)->toBe(3)
        ->and($statistics->last()->location)->toBe('Gedung B')
        ->and((int) $statistics->last()->report_count)->toBe(1);
});
