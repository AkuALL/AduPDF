<?php

namespace Database\Seeders;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Seed one facility for each facility type.
     */
    public function run(): void
    {
        $classroom = Facility::query()->updateOrCreate(
            ['name' => 'Ruang Kelas A-101', 'type' => FacilityType::Classroom, 'location' => 'Gedung A'],
            ['capacity' => 40, 'description' => 'Ruang kuliah reguler.', 'condition' => FacilityCondition::Active],
        );

        Facility::query()->updateOrCreate(
            ['name' => 'Aula Serbaguna', 'type' => FacilityType::Hall, 'location' => 'Gedung Utama'],
            ['capacity' => 200, 'description' => 'Aula untuk kegiatan kampus.', 'condition' => FacilityCondition::Active],
        );

        Facility::query()->updateOrCreate(
            ['name' => 'Laboratorium Komputer', 'type' => FacilityType::Laboratory, 'location' => 'Gedung B'],
            ['capacity' => 35, 'description' => 'Laboratorium praktikum komputer.', 'condition' => FacilityCondition::Active],
        );

        Facility::query()->updateOrCreate(
            ['name' => 'Proyektor A-101', 'type' => FacilityType::Equipment, 'location' => 'Gedung A'],
            [
                'capacity' => 0,
                'description' => 'Proyektor untuk Ruang Kelas A-101.',
                'condition' => FacilityCondition::Active,
                'parent_facility_id' => $classroom->id,
            ],
        );

        Facility::query()->updateOrCreate(
            ['name' => 'Lapangan Basket', 'type' => FacilityType::Field, 'location' => 'Area Olahraga'],
            ['capacity' => 100, 'description' => 'Lapangan olahraga terbuka.', 'condition' => FacilityCondition::Active],
        );
    }
}
