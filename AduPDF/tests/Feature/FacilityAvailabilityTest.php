<?php

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Carbon\CarbonImmutable;
use Inertia\Testing\AssertableInertia as Assert;

test('guests can see 26 30-minute availability slots from 07:00 to 20:00 for a facility', function () {
    $facility = Facility::factory()->create([
        'name' => 'Ruang Teater A',
        'type' => FacilityType::Hall,
    ]);

    $response = $this->get("/facilities/{$facility->id}?date=2026-09-20");

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('facility.id', $facility->id)
        ->where('selectedDate', '2026-09-20')
        ->where('availability.date', '2026-09-20')
        ->where('availability.is_reservable', true)
        ->where('availability.total_slots', 26)
        ->where('availability.available_slots_count', 26)
        ->where('availability.occupied_slots_count', 0)
        ->has('availability.slots', 26)
        ->where('availability.slots.0.start_time', '07:00')
        ->where('availability.slots.0.end_time', '07:30')
        ->where('availability.slots.0.is_available', true)
        ->where('availability.slots.0.status', 'tersedia')
        ->where('availability.slots.25.start_time', '19:30')
        ->where('availability.slots.25.end_time', '20:00')
        ->where('availability.slots.25.is_available', true)
    );
});

test('public availability hides reservation owner and purpose per FR-02', function () {
    $user = User::factory()->create([
        'name' => 'Budi Rahasia',
        'email' => 'budi.rahasia@example.com',
    ]);
    $facility = Facility::factory()->create(['name' => 'Ruang Seminar 1']);

    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Rapat Rahasia Organisasi Kampus',
        'start_time' => CarbonImmutable::parse('2026-09-20 09:00:00', 'Asia/Jakarta')->utc(),
        'end_time' => CarbonImmutable::parse('2026-09-20 10:00:00', 'Asia/Jakarta')->utc(),
        'status' => ReservationStatus::Approved,
    ]);

    $response = $this->get("/facilities/{$facility->id}?date=2026-09-20");

    $response->assertOk();

    // Verify slots 09:00-09:30 (index 4) and 09:30-10:00 (index 5) are occupied
    $response->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('availability.available_slots_count', 24)
        ->where('availability.occupied_slots_count', 2)
        ->where('availability.slots.4.start_time', '09:00')
        ->where('availability.slots.4.is_available', false)
        ->where('availability.slots.4.status', 'terisi')
        ->where('availability.slots.5.start_time', '09:30')
        ->where('availability.slots.5.is_available', false)
        ->where('availability.slots.5.status', 'terisi')
        ->where('availability.slots.6.start_time', '10:00')
        ->where('availability.slots.6.is_available', true)
        ->missing('facility.reservations')
    );

    // FR-02: Guest does not receive user identity or purpose in response
    $response->assertDontSee('Budi Rahasia');
    $response->assertDontSee('budi.rahasia@example.com');
    $response->assertDontSee('Rapat Rahasia Organisasi Kampus');
});

test('full room reservation makes all its child tools unavailable for that slot', function () {
    $user = User::factory()->create();
    $room = Facility::factory()->create(['name' => 'Lab Komputer']);
    $tool = Facility::factory()->tool($room)->create(['name' => 'PC Master 01']);

    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $room->id,
        'tujuan' => 'Praktikum Pemrograman Web',
        'start_time' => CarbonImmutable::parse('2026-09-20 10:00:00', 'Asia/Jakarta')->utc(),
        'end_time' => CarbonImmutable::parse('2026-09-20 11:00:00', 'Asia/Jakarta')->utc(),
        'status' => ReservationStatus::Approved,
    ]);

    $response = $this->get("/facilities/{$tool->id}?date=2026-09-20");

    // Tool 10:00-11:00 should be unavailable because parent room is booked
    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('facility.id', $tool->id)
        ->where('availability.slots.6.start_time', '10:00')
        ->where('availability.slots.6.is_available', false)
        ->where('availability.slots.6.status', 'terisi')
        ->where('availability.slots.7.start_time', '10:30')
        ->where('availability.slots.7.is_available', false)
        ->where('availability.slots.7.status', 'terisi')
        ->where('availability.slots.8.start_time', '11:00')
        ->where('availability.slots.8.is_available', true)
    );
});

test('child tool reservation makes parent room unavailable but sibling tool remains available', function () {
    $user = User::factory()->create();
    $room = Facility::factory()->create(['name' => 'Studio Musik']);
    $toolA = Facility::factory()->tool($room)->create(['name' => 'Gitar Elektrik']);
    $toolB = Facility::factory()->tool($room)->create(['name' => 'Drum Kit']);

    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $toolA->id,
        'tujuan' => 'Latihan Solo Gitar',
        'start_time' => CarbonImmutable::parse('2026-09-20 13:00:00', 'Asia/Jakarta')->utc(),
        'end_time' => CarbonImmutable::parse('2026-09-20 14:00:00', 'Asia/Jakarta')->utc(),
        'status' => ReservationStatus::Approved,
    ]);

    // Parent Room should be unavailable for 13:00-14:00
    $roomResponse = $this->get("/facilities/{$room->id}?date=2026-09-20");
    $roomResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('availability.slots.12.start_time', '13:00')
        ->where('availability.slots.12.is_available', false)
        ->where('availability.slots.13.start_time', '13:30')
        ->where('availability.slots.13.is_available', false)
    );

    // Booked Tool A should be unavailable for 13:00-14:00
    $toolAResponse = $this->get("/facilities/{$toolA->id}?date=2026-09-20");
    $toolAResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('availability.slots.12.start_time', '13:00')
        ->where('availability.slots.12.is_available', false)
    );

    // Sibling Tool B should remain AVAILABLE for 13:00-14:00
    $toolBResponse = $this->get("/facilities/{$toolB->id}?date=2026-09-20");
    $toolBResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('availability.slots.12.start_time', '13:00')
        ->where('availability.slots.12.is_available', true)
        ->where('availability.slots.13.start_time', '13:30')
        ->where('availability.slots.13.is_available', true)
    );
});

test('facility under repair or inactive marks all slots unavailable with appropriate status', function () {
    $brokenRoom = Facility::factory()->create([
        'name' => 'Lab Kimia',
        'condition' => FacilityCondition::UnderRepair,
    ]);
    $toolInBrokenRoom = Facility::factory()->tool($brokenRoom)->create([
        'name' => 'Mikroskop 01',
        'condition' => FacilityCondition::Active,
    ]);

    // Broken Room has all slots unavailable
    $roomResponse = $this->get("/facilities/{$brokenRoom->id}?date=2026-09-20");
    $roomResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('availability.is_reservable', false)
        ->where('availability.available_slots_count', 0)
        ->where('availability.occupied_slots_count', 26)
        ->where('availability.slots.0.is_available', false)
        ->where('availability.slots.0.status', 'dalam_perbaikan')
    );

    // Tool inside broken room is also unavailable for all slots
    $toolResponse = $this->get("/facilities/{$toolInBrokenRoom->id}?date=2026-09-20");
    $toolResponse->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('availability.is_reservable', false)
        ->where('availability.available_slots_count', 0)
        ->where('availability.occupied_slots_count', 26)
        ->where('availability.slots.0.is_available', false)
        ->where('availability.slots.0.status', 'dalam_perbaikan')
    );
});
