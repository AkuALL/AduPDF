<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Models\Facility;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'facility_id' => Facility::factory(),
            'kategori' => fake()->words(2, true),
            'deskripsi' => fake()->paragraph(),
            'status_laporan' => ReportStatus::New,
            'catatan_resolusi' => null,
        ];
    }
}
