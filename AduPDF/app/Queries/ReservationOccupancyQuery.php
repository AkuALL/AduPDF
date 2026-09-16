<?php

namespace App\Queries;

use App\Models\Facility;
use App\Models\Reservation;
use App\Services\ReservationConflictService;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;

class ReservationOccupancyQuery
{
    public function __construct(private ReservationConflictService $conflicts) {}

    /**
     * @return Collection<int, Reservation>
     */
    public function forFacility(Facility $facility, CarbonInterface $startTime, CarbonInterface $endTime): Collection
    {
        return $this->conflicts->approvedOccupancies($facility, $startTime, $endTime);
    }
}
