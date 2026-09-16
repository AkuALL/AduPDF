<?php

use App\Enums\FacilityType;
use App\Models\Facility;

test('a room can contain tools', function () {
    $room = Facility::factory()->create(['type' => FacilityType::Laboratory]);
    $tool = Facility::factory()->tool($room)->create();

    expect($tool->parentFacility->is($room))->toBeTrue()
        ->and($room->childTools->sole()->is($tool))->toBeTrue()
        ->and($room->isRoom())->toBeTrue()
        ->and($tool->isTool())->toBeTrue();
});

test('a tool requires a room parent', function () {
    Facility::factory()->create([
        'type' => FacilityType::Equipment,
    ]);
})->throws(LogicException::class, 'Fasilitas bertipe alat wajib memiliki ruangan induk.');

test('a tool cannot use a field as its parent', function () {
    $field = Facility::factory()->field()->create();

    Facility::factory()->tool($field)->create();
})->throws(LogicException::class, 'Ruangan induk alat harus bertipe ruang kelas, aula, atau laboratorium.');

test('a room with tools cannot be changed into a field', function () {
    $room = Facility::factory()->create();
    Facility::factory()->tool($room)->create();

    $room->update(['type' => FacilityType::Field]);
})->throws(LogicException::class, 'Lapangan tidak dapat memiliki alat.');
