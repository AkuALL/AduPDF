<?php

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use App\Services\FacilityConditionService;

test('deactivating a facility via deactivate endpoint automatically rejects pending and cancels approved reservations (AG-06, FR-18)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();
    $facility = Facility::factory()->create(['condition' => FacilityCondition::Active]);

    // 1. Future pending reservation
    $pendingReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Rapat Proyek Baru',
        'start_time' => now()->addDays(2),
        'end_time' => now()->addDays(2)->addHours(2),
        'status' => ReservationStatus::Pending,
    ]);

    // 2. Future approved reservation
    $approvedReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Seminar Mahasiswa',
        'start_time' => now()->addDays(3),
        'end_time' => now()->addDays(3)->addHours(3),
        'status' => ReservationStatus::Approved,
    ]);

    // 3. Past completed approved reservation
    $pastReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Kuliah Tamu Minggu Lalu',
        'start_time' => now()->subDays(5),
        'end_time' => now()->subDays(5)->addHours(2),
        'status' => ReservationStatus::Approved,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.facilities.deactivate', $facility));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Assert facility status is inactive
    expect($facility->refresh()->condition)->toBe(FacilityCondition::Inactive);

    // Assert future reservations are transitioned
    expect($pendingReservation->refresh()->status)->toBe(ReservationStatus::Rejected)
        ->and($approvedReservation->refresh()->status)->toBe(ReservationStatus::Cancelled)
        // Assert past reservation is preserved
        ->and($pastReservation->refresh()->status)->toBe(ReservationStatus::Approved);
});

test('deactivating a room also cancels and rejects reservations on its child tools without changing tool condition (AG-06)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    $room = Facility::factory()->create([
        'type' => FacilityType::Laboratory,
        'condition' => FacilityCondition::Active,
    ]);

    $tool = Facility::factory()->tool($room)->create([
        'condition' => FacilityCondition::Active,
    ]);

    // Reservations on room
    $roomApproved = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $room->id,
        'tujuan' => 'Praktikum Jaringan Komputer',
        'start_time' => now()->addDays(1),
        'end_time' => now()->addDays(1)->addHours(2),
        'status' => ReservationStatus::Approved,
    ]);

    // Reservations on tool
    $toolApproved = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $tool->id,
        'tujuan' => 'Peminjaman Tool Lab',
        'start_time' => now()->addDays(2),
        'end_time' => now()->addDays(2)->addHours(2),
        'status' => ReservationStatus::Approved,
    ]);

    $toolPending = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $tool->id,
        'tujuan' => 'Peminjaman Tool Pending',
        'start_time' => now()->addDays(4),
        'end_time' => now()->addDays(4)->addHours(2),
        'status' => ReservationStatus::Pending,
    ]);

    // Admin deactivates parent room
    $this->actingAs($admin)->patch(route('admin.facilities.deactivate', $room));

    expect($room->refresh()->condition)->toBe(FacilityCondition::Inactive)
        // Child tool database condition remains unchanged per jobdesc rule
        ->and($tool->refresh()->condition)->toBe(FacilityCondition::Active)
        // Child tool is now not reservable through condition service
        ->and(app(FacilityConditionService::class)->isReservable($tool))->toBeFalse();

    // Assert reservations on both room and tool are cancelled/rejected
    expect($roomApproved->refresh()->status)->toBe(ReservationStatus::Cancelled)
        ->and($toolApproved->refresh()->status)->toBe(ReservationStatus::Cancelled)
        ->and($toolPending->refresh()->status)->toBe(ReservationStatus::Rejected);
});

test('updating facility condition to nonaktif via edit form also triggers deactivation impact (AG-06)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    $facility = Facility::factory()->create([
        'name' => 'Aula Serbaguna Utama',
        'condition' => FacilityCondition::Active,
    ]);

    $approvedReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Wisuda Periode 1',
        'start_time' => now()->addDays(5),
        'end_time' => now()->addDays(5)->addHours(4),
        'status' => ReservationStatus::Approved,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.facilities.update', $facility), [
        'name' => $facility->name,
        'type' => $facility->type->value,
        'location' => $facility->location,
        'capacity' => $facility->capacity,
        'condition' => FacilityCondition::Inactive->value,
        'parent_facility_id' => null,
    ]);

    $response->assertRedirect(route('admin.facilities.show', $facility));
    expect($facility->refresh()->condition)->toBe(FacilityCondition::Inactive)
        ->and($approvedReservation->refresh()->status)->toBe(ReservationStatus::Cancelled);
});

test('deactivating a child tool only affects that tool and does not cancel sibling tools or parent room reservations (AG-06)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    $room = Facility::factory()->create(['type' => FacilityType::Laboratory]);
    $toolA = Facility::factory()->tool($room)->create();
    $toolB = Facility::factory()->tool($room)->create();

    $roomReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $room->id,
        'tujuan' => 'Kegiatan Kelas',
        'start_time' => now()->addDays(1),
        'end_time' => now()->addDays(1)->addHours(2),
        'status' => ReservationStatus::Approved,
    ]);

    $toolAReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $toolA->id,
        'tujuan' => 'Kegiatan Tool A',
        'start_time' => now()->addDays(2),
        'end_time' => now()->addDays(2)->addHours(2),
        'status' => ReservationStatus::Approved,
    ]);

    $toolBReservation = Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $toolB->id,
        'tujuan' => 'Kegiatan Tool B',
        'start_time' => now()->addDays(3),
        'end_time' => now()->addDays(3)->addHours(2),
        'status' => ReservationStatus::Approved,
    ]);

    // Admin deactivates ONLY Tool A
    $this->actingAs($admin)->patch(route('admin.facilities.deactivate', $toolA));

    expect($toolA->refresh()->condition)->toBe(FacilityCondition::Inactive)
        ->and($toolAReservation->refresh()->status)->toBe(ReservationStatus::Cancelled)
        // Room and Tool B reservations remain Approved!
        ->and($roomReservation->refresh()->status)->toBe(ReservationStatus::Approved)
        ->and($toolBReservation->refresh()->status)->toBe(ReservationStatus::Approved);
});
