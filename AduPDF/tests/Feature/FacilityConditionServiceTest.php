<?php

use App\Enums\FacilityCondition;
use App\Models\Facility;
use App\Services\FacilityConditionService;

test('a room under repair or inactive makes its tools not reservable without changing their conditions', function (FacilityCondition $condition) {
    $service = app(FacilityConditionService::class);
    $room = Facility::factory()->create();
    $tool = Facility::factory()->tool($room)->create();

    $service->updateCondition($room, $condition);

    expect($room->refresh()->condition)->toBe($condition)
        ->and($tool->refresh()->condition)->toBe(FacilityCondition::Active)
        ->and($service->isReservable($tool))->toBeFalse();
})->with([
    FacilityCondition::UnderRepair,
    FacilityCondition::Inactive,
]);

test('a tool under repair does not make its parent room or sibling tool unavailable', function () {
    $service = app(FacilityConditionService::class);
    $room = Facility::factory()->create();
    $toolUnderRepair = Facility::factory()->tool($room)->create();
    $siblingTool = Facility::factory()->tool($room)->create();

    $service->updateCondition($toolUnderRepair, FacilityCondition::UnderRepair);

    expect($service->isReservable($toolUnderRepair))->toBeFalse()
        ->and($service->isReservable($room))->toBeTrue()
        ->and($service->isReservable($siblingTool))->toBeTrue();
});

test('updating a facility condition does not mutate child tool records', function () {
    $service = app(FacilityConditionService::class);
    $room = Facility::factory()->create();
    $tool = Facility::factory()->tool($room)->create();

    $updatedRoom = $service->updateCondition($room, FacilityCondition::Inactive);

    expect($updatedRoom->condition)->toBe(FacilityCondition::Inactive)
        ->and($tool->refresh()->condition)->toBe(FacilityCondition::Active);
});
