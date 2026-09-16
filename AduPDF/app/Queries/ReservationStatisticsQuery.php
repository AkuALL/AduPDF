<?php

namespace App\Queries;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;

class ReservationStatisticsQuery
{
    /**
     * @return Builder<Reservation>
     */
    public function approvedOverlapping(CarbonInterface $startTime, CarbonInterface $endTime): Builder
    {
        return Reservation::query()
            ->with('facility:id,name,location,type')
            ->where('status', ReservationStatus::Approved->value)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->orderBy('start_time');
    }
}
