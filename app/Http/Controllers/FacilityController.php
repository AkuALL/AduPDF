<?php

namespace App\Http\Controllers;

use App\Enums\FacilityType;
use App\Models\Facility;
use App\Services\FacilityAvailabilityService;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', Rule::enum(FacilityType::class)],
            'location' => ['nullable', 'string', 'max:100'],
            'minimum_capacity' => ['nullable', 'integer', 'min:0'],
        ]);

        $facilities = Facility::query()
            ->with('parentFacility:id,name')
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($filters['type'] ?? null, fn (Builder $query, string $type): Builder => $query->where('type', $type))
            ->when($filters['location'] ?? null, fn (Builder $query, string $location): Builder => $query->where('location', $location))
            ->when($filters['minimum_capacity'] ?? null, fn (Builder $query, string $capacity): Builder => $query->where('capacity', '>=', $capacity))
            ->orderBy('name')
            ->get()
            ->map(fn (Facility $facility): array => $this->toPublicData($facility))
            ->values();

        return Inertia::render('facilities/index', [
            'facilities' => $facilities,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'type' => $filters['type'] ?? '',
                'location' => $filters['location'] ?? '',
                'minimum_capacity' => isset($filters['minimum_capacity']) ? (int) $filters['minimum_capacity'] : '',
            ],
            'locations' => Facility::query()->distinct()->orderBy('location')->pluck('location')->values(),
            'types' => collect(FacilityType::cases())->map(fn (FacilityType $type): array => [
                'value' => $type->value,
                'label' => $this->typeLabel($type),
            ])->values(),
        ]);
    }

    public function show(Request $request, Facility $facility, FacilityAvailabilityService $availabilityService): Response
    {
        $validated = $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $selectedDate = $validated['date'] ?? CarbonImmutable::now('Asia/Jakarta')->format('Y-m-d');

        $facility->load([
            'parentFacility:id,name',
            'childTools:id,name,type,condition,parent_facility_id',
        ]);

        $availability = $availabilityService->getAvailability($facility, $selectedDate);

        return Inertia::render('facilities/show', [
            'facility' => $this->toPublicData($facility, true),
            'availability' => $availability,
            'selectedDate' => $selectedDate,
        ]);
    }

    /**
     * @return array<string, int|string|array<string, int|string|null>|array<int, array<string, int|string|array<string, int|string|null>>>|null>
     */
    private function toPublicData(Facility $facility, bool $withChildTools = false): array
    {
        return [
            'id' => $facility->id,
            'name' => $facility->name,
            'type' => $facility->type->value,
            'location' => $facility->location,
            'capacity' => $facility->capacity,
            'description' => $facility->description,
            'condition' => $facility->condition->value,
            'parent_facility' => $facility->parentFacility === null ? null : [
                'id' => $facility->parentFacility->id,
                'name' => $facility->parentFacility->name,
            ],
            'child_tools' => $withChildTools
                ? $facility->childTools->map(fn (Facility $tool): array => [
                    'id' => $tool->id,
                    'name' => $tool->name,
                    'type' => $tool->type->value,
                    'condition' => $tool->condition->value,
                ])->values()->all()
                : [],
        ];
    }

    private function typeLabel(FacilityType $type): string
    {
        return match ($type) {
            FacilityType::Classroom => 'Ruang kelas',
            FacilityType::Hall => 'Aula',
            FacilityType::Laboratory => 'Laboratorium',
            FacilityType::Equipment => 'Alat',
            FacilityType::Field => 'Lapangan',
        };
    }
}
