<?php

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;

test('unauthenticated users and non-admin users cannot access admin facility management', function () {
    $guestResponse = $this->get(route('admin.facilities.index'));
    $guestResponse->assertRedirect(route('login'));

    $pengguna = User::factory()->pengguna()->create();
    $this->actingAs($pengguna)->get(route('admin.facilities.index'))->assertForbidden();

    $petugas = User::factory()->petugas()->create();
    $this->actingAs($petugas)->get(route('admin.facilities.index'))->assertForbidden();
});

test('admin can view facility list with search and filters', function () {
    $admin = User::factory()->admin()->create();

    Facility::factory()->create([
        'name' => 'Ruang Teater Komputer',
        'type' => FacilityType::Hall,
        'condition' => FacilityCondition::Active,
        'location' => 'Gedung C',
    ]);

    Facility::factory()->create([
        'name' => 'Lapangan Futsal',
        'type' => FacilityType::Field,
        'condition' => FacilityCondition::UnderRepair,
        'location' => 'Area Olahraga',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.facilities.index', ['search' => 'Teater']));
    $response->assertOk();
    $response->assertSee('Ruang Teater Komputer');
    $response->assertDontSee('Lapangan Futsal');
});

test('admin can create a room facility', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'name' => 'Ruang Kuliah A.101',
        'type' => FacilityType::Classroom->value,
        'location' => 'Gedung A Lt. 1',
        'capacity' => 50,
        'description' => 'Lengkap dengan proyektor dan AC.',
        'condition' => FacilityCondition::Active->value,
    ];

    $response = $this->actingAs($admin)->post(route('admin.facilities.store'), $payload);

    $this->assertDatabaseHas('facilities', [
        'name' => 'Ruang Kuliah A.101',
        'type' => FacilityType::Classroom->value,
        'capacity' => 50,
        'parent_facility_id' => null,
    ]);

    $facility = Facility::where('name', 'Ruang Kuliah A.101')->firstOrFail();
    $response->assertRedirect(route('admin.facilities.show', $facility));
});

test('admin can create a tool facility with valid parent room', function () {
    $admin = User::factory()->admin()->create();
    $room = Facility::factory()->create(['type' => FacilityType::Laboratory]);

    $payload = [
        'name' => 'Mikroskop Digital 01',
        'type' => FacilityType::Equipment->value,
        'location' => $room->location,
        'capacity' => 1,
        'description' => 'Mikroskop lab biologi.',
        'condition' => FacilityCondition::Active->value,
        'parent_facility_id' => $room->id,
    ];

    $response = $this->actingAs($admin)->post(route('admin.facilities.store'), $payload);

    $this->assertDatabaseHas('facilities', [
        'name' => 'Mikroskop Digital 01',
        'type' => FacilityType::Equipment->value,
        'parent_facility_id' => $room->id,
    ]);

    $tool = Facility::where('name', 'Mikroskop Digital 01')->firstOrFail();
    $response->assertRedirect(route('admin.facilities.show', $tool));
});

test('admin cannot create a tool without parent room or with field parent', function () {
    $admin = User::factory()->admin()->create();
    $field = Facility::factory()->field()->create();

    // 1. Tool without parent
    $responseWithoutParent = $this->actingAs($admin)->post(route('admin.facilities.store'), [
        'name' => 'Speaker Portable',
        'type' => FacilityType::Equipment->value,
        'location' => 'Ruang Musik',
        'capacity' => 0,
        'condition' => FacilityCondition::Active->value,
        'parent_facility_id' => null,
    ]);
    $responseWithoutParent->assertSessionHasErrors('parent_facility_id');

    // 2. Tool with field as parent
    $responseWithFieldParent = $this->actingAs($admin)->post(route('admin.facilities.store'), [
        'name' => 'Gawang Mini',
        'type' => FacilityType::Equipment->value,
        'location' => 'Lapangan',
        'capacity' => 0,
        'condition' => FacilityCondition::Active->value,
        'parent_facility_id' => $field->id,
    ]);
    $responseWithFieldParent->assertSessionHasErrors('parent_facility_id');
});

test('admin can update a facility', function () {
    $admin = User::factory()->admin()->create();
    $facility = Facility::factory()->create([
        'name' => 'Aula Gedung Lama',
        'capacity' => 150,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.facilities.update', $facility), [
        'name' => 'Aula Gedung Baru',
        'type' => $facility->type->value,
        'location' => 'Gedung Baru Lt. 3',
        'capacity' => 250,
        'condition' => FacilityCondition::Active->value,
        'description' => 'Sudah direnovasi.',
        'parent_facility_id' => null,
    ]);

    $response->assertRedirect(route('admin.facilities.show', $facility));

    $this->assertDatabaseHas('facilities', [
        'id' => $facility->id,
        'name' => 'Aula Gedung Baru',
        'capacity' => 250,
        'location' => 'Gedung Baru Lt. 3',
    ]);
});

test('admin can update a facility using PATCH method per SRS V2 spec', function () {
    $admin = User::factory()->admin()->create();
    $facility = Facility::factory()->create([
        'name' => 'Aula Gedung Lama',
        'capacity' => 150,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.facilities.update', $facility), [
        'name' => 'Aula Gedung Baru PATCH',
        'type' => $facility->type->value,
        'location' => 'Gedung Baru Lt. 3',
        'capacity' => 250,
        'condition' => FacilityCondition::Active->value,
        'description' => 'Sudah direnovasi.',
        'parent_facility_id' => null,
    ]);

    $response->assertRedirect(route('admin.facilities.show', $facility));

    $this->assertDatabaseHas('facilities', [
        'id' => $facility->id,
        'name' => 'Aula Gedung Baru PATCH',
    ]);
});

test('admin cannot change a room type to field if it contains child tools', function () {
    $admin = User::factory()->admin()->create();
    $room = Facility::factory()->create(['type' => FacilityType::Laboratory]);
    Facility::factory()->tool($room)->create();

    $response = $this->actingAs($admin)->put(route('admin.facilities.update', $room), [
        'name' => $room->name,
        'type' => FacilityType::Field->value,
        'location' => $room->location,
        'capacity' => $room->capacity,
        'condition' => $room->condition->value,
        'parent_facility_id' => null,
    ]);

    $response->assertSessionHasErrors('type');
});

test('admin can activate and deactivate a facility', function () {
    $admin = User::factory()->admin()->create();
    $facility = Facility::factory()->create(['condition' => FacilityCondition::Active]);

    // Deactivate
    $response = $this->actingAs($admin)->patch(route('admin.facilities.deactivate', $facility));
    $response->assertRedirect();
    expect($facility->refresh()->condition)->toBe(FacilityCondition::Inactive);

    // Activate
    $response = $this->actingAs($admin)->patch(route('admin.facilities.activate', $facility));
    $response->assertRedirect();
    expect($facility->refresh()->condition)->toBe(FacilityCondition::Active);
});

test('admin cannot hard delete facility that has reservation history or child tools per FR-18', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    // 1. Facility with reservation history
    $facilityWithHistory = Facility::factory()->create();
    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $facilityWithHistory->id,
        'tujuan' => 'Rapat Tahunan',
        'start_time' => now()->addDays(2),
        'end_time' => now()->addDays(2)->addHours(2),
        'status' => ReservationStatus::Approved,
    ]);

    $responseHistory = $this->actingAs($admin)->delete(route('admin.facilities.destroy', $facilityWithHistory));
    $responseHistory->assertSessionHas('error');
    $this->assertDatabaseHas('facilities', ['id' => $facilityWithHistory->id]);

    // 2. Room with child tools
    $roomWithTools = Facility::factory()->create(['type' => FacilityType::Laboratory]);
    $tool = Facility::factory()->tool($roomWithTools)->create();

    $responseRoom = $this->actingAs($admin)->delete(route('admin.facilities.destroy', $roomWithTools));
    $responseRoom->assertSessionHas('error');
    $this->assertDatabaseHas('facilities', ['id' => $roomWithTools->id]);

    // 3. Facility without history or child tools can be deleted
    $unusedFacility = Facility::factory()->create();
    $responseSuccess = $this->actingAs($admin)->delete(route('admin.facilities.destroy', $unusedFacility));
    $responseSuccess->assertRedirect(route('admin.facilities.index'));
    $this->assertDatabaseMissing('facilities', ['id' => $unusedFacility->id]);
});
