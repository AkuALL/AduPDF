<?php

use App\Enums\ReportStatus;
use App\Models\Report;
use App\Models\ReportAttachment;

test('a report belongs to its reporter and facility', function () {
    $report = Report::factory()->create();

    expect($report->user)->not->toBeNull()
        ->and($report->facility)->not->toBeNull()
        ->and($report->status_laporan)->toBe(ReportStatus::New);
});

test('a report has supporting attachments', function () {
    $report = Report::factory()
        ->has(ReportAttachment::factory()->count(2), 'attachments')
        ->create();

    expect($report->attachments)->toHaveCount(2)
        ->and($report->attachments->every(fn (ReportAttachment $attachment): bool => $attachment->report->is($report)))->toBeTrue();
});

test('a report has not reached its attachment limit below eight attachments', function () {
    $report = Report::factory()
        ->has(ReportAttachment::factory()->count(7), 'attachments')
        ->create();

    expect($report->hasReachedAttachmentLimit())->toBeFalse();
});

test('a report reaches its attachment limit at eight attachments', function () {
    $report = Report::factory()
        ->has(ReportAttachment::factory()->count(8), 'attachments')
        ->create();

    expect(Report::MAX_ATTACHMENTS)->toBe(8)
        ->and($report->hasReachedAttachmentLimit())->toBeTrue();
});

test('a report cannot have more than eight attachments', function () {
    $report = Report::factory()
        ->has(ReportAttachment::factory()->count(8), 'attachments')
        ->create();

    ReportAttachment::factory()->for($report)->create();
})->throws(LogicException::class, 'Satu laporan hanya dapat memiliki maksimal 8 lampiran.');
