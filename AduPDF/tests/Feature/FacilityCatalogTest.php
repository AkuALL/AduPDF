<?php

use App\Enums\FacilityType;
use App\Models\Facility;
use Inertia\Testing\AssertableInertia as Assert;

test('guests can filter the public facility catalog', function () {
    $laboratory = Facility::factory()->create([
        'name' => 'Laboratorium Komputer',
        'type' => FacilityType::Laboratory,
        'location' => 'Gedung A',
        'capacity' => 40,
    ]);

    Facility::factory()->create([
        'name' => 'Aula Serbaguna',
        'type' => FacilityType::Hall,
        'location' => 'Gedung B',
        'capacity' => 200,
    ]);

    $response = $this->get('/facilities?search=Komputer&type=laboratorium&location=Gedung%20A&minimum_capacity=30');

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/index')
        ->where('filters.search', 'Komputer')
        ->where('filters.type', 'laboratorium')
        ->where('filters.location', 'Gedung A')
        ->where('filters.minimum_capacity', 30)
        ->has('facilities', 1)
        ->where('facilities.0.id', $laboratory->id)
        ->where('facilities.0.name', 'Laboratorium Komputer')
        ->where('facilities.0.location', 'Gedung A')
    );
});

test('guests can view a facility and its child tools without reservation data', function () {
    $room = Facility::factory()->create(['name' => 'Lab Multimedia']);
    $tool = Facility::factory()->tool($room)->create(['name' => 'Projector 01']);

    $response = $this->get("/facilities/{$room->id}");

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('facilities/show')
        ->where('facility.id', $room->id)
        ->where('facility.name', 'Lab Multimedia')
        ->has('facility.child_tools', 1)
        ->where('facility.child_tools.0.id', $tool->id)
        ->where('facility.child_tools.0.name', 'Projector 01')
        ->missing('facility.reservations')
    );
});
