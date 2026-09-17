<?php

namespace App\Services;

use App\Enums\FacilityCondition;
use App\Models\Facility;
use App\Models\Reservation;
use App\Queries\ReservationOccupancyQuery;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class FacilityAvailabilityService
{
    public const OPERATING_START_HOUR = 7;

    public const OPERATING_END_HOUR = 20;

    public const SLOT_DURATION_MINUTES = 30;

    public function __construct(
        private FacilityConditionService $conditionService,
        private ReservationOccupancyQuery $occupancyQuery,
    ) {}

    /**
     * @return array{
     *     date: string,
     *     is_reservable: bool,
     *     total_slots: int,
     *     available_slots_count: int,
     *     occupied_slots_count: int,
     *     slots: array<int, array{
     *         start_time: string,
     *         end_time: string,
     *         is_available: bool,
     *         status: string,
     *         label: string
     *     }>
     * }
     */
    public function getAvailability(Facility $facility, string|CarbonInterface $date): array
    {
        $dateString = $date instanceof CarbonInterface ? $date->format('Y-m-d') : $date;
        $isReservable = $this->conditionService->isReservable($facility);

        /** @var Collection<int, Reservation> $occupancies */
        $occupancies = collect();
        if ($isReservable) {
            $dayStart = CarbonImmutable::parse("{$dateString} 07:00:00", 'Asia/Jakarta')->utc();
            $dayEnd = CarbonImmutable::parse("{$dateString} 20:00:00", 'Asia/Jakarta')->utc();

            $occupancies = $this->occupancyQuery->forFacility($facility, $dayStart, $dayEnd);
        }

        $effectiveCondition = $this->getEffectiveCondition($facility);

        $slots = [];
        $availableCount = 0;
        $occupiedCount = 0;

        $currentTime = CarbonImmutable::parse("{$dateString} 07:00:00", 'Asia/Jakarta');
        $endTime = CarbonImmutable::parse("{$dateString} 20:00:00", 'Asia/Jakarta');

        while ($currentTime->lt($endTime)) {
            $nextTime = $currentTime->addMinutes(self::SLOT_DURATION_MINUTES);
            $startWib = $currentTime->format('H:i');
            $endWib = $nextTime->format('H:i');

            if (! $isReservable) {
                $status = match ($effectiveCondition) {
                    FacilityCondition::UnderRepair => 'dalam_perbaikan',
                    FacilityCondition::Inactive => 'nonaktif',
                    default => 'tidak_tersedia',
                };
                $label = match ($effectiveCondition) {
                    FacilityCondition::UnderRepair => 'Dalam Perbaikan',
                    FacilityCondition::Inactive => 'Nonaktif',
                    default => 'Tidak Tersedia',
                };
                $isAvailable = false;
                $occupiedCount++;
            } else {
                $slotStartUtc = $currentTime->utc();
                $slotEndUtc = $nextTime->utc();

                $isOccupied = $occupancies->contains(function (Reservation $reservation) use ($slotStartUtc, $slotEndUtc): bool {
                    return $reservation->start_time->lt($slotEndUtc) && $reservation->end_time->gt($slotStartUtc);
                });

                if ($isOccupied) {
                    $status = 'terisi';
                    $label = 'Sudah Direservasi';
                    $isAvailable = false;
                    $occupiedCount++;
                } else {
                    $status = 'tersedia';
                    $label = 'Tersedia';
                    $isAvailable = true;
                    $availableCount++;
                }
            }

            $slots[] = [
                'start_time' => $startWib,
                'end_time' => $endWib,
                'is_available' => $isAvailable,
                'status' => $status,
                'label' => $label,
            ];

            $currentTime = $nextTime;
        }

        return [
            'date' => $dateString,
            'is_reservable' => $isReservable,
            'total_slots' => count($slots),
            'available_slots_count' => $availableCount,
            'occupied_slots_count' => $occupiedCount,
            'slots' => $slots,
        ];
    }

    private function getEffectiveCondition(Facility $facility): FacilityCondition
    {
        if ($facility->condition !== FacilityCondition::Active) {
            return $facility->condition;
        }

        if ($facility->isTool()) {
            $parent = $facility->parentFacility()->first();
            if ($parent !== null && $parent->condition !== FacilityCondition::Active) {
                return $parent->condition;
            }
        }

        return FacilityCondition::Active;
    }
}
