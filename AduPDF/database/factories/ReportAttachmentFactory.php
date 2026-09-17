<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\ReportAttachment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReportAttachment>
 */
class ReportAttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'report_id' => Report::factory(),
            'file_path' => 'reports/'.fake()->uuid().'.jpg',
            'original_name' => fake()->word().'.jpg',
            'mime_type' => fake()->randomElement(['image/jpeg', 'image/png']),
            'file_size' => fake()->numberBetween(1, 2 * 1024 * 1024),
        ];
    }
}
