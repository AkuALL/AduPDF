<?php

use App\Enums\FacilityType;
use App\Models\Facility;
use Database\Seeders\FacilitySeeder;

test('facility seeder creates one facility for each type', function () {
    $this->seed(FacilitySeeder::class);

    foreach (FacilityType::cases() as $type) {
        expect(Facility::query()->where('type', $type)->exists())->toBeTrue();
    }

    $equipment = Facility::query()->where('type', FacilityType::Equipment)->sole();

    expect($equipment->parentFacility->type)->toBe(FacilityType::Classroom);
});
