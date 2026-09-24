<?php

namespace Database\Factories;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Facility>
 */
class FacilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'type' => FacilityType::Classroom,
            'location' => fake()->buildingNumber(),
            'capacity' => fake()->numberBetween(0, 200),
            'description' => fake()->sentence(),
            'condition' => FacilityCondition::Active,
        ];
    }

    public function field(): static
    {
        return $this->state(fn (): array => [
            'type' => FacilityType::Field,
        ]);
    }

    public function tool(Facility $parentFacility): static
    {
        return $this->state(fn (): array => [
            'type' => FacilityType::Equipment,
            'parent_facility_id' => $parentFacility->id,
        ]);
    }
}
