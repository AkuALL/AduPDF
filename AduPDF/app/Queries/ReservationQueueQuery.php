<?php

namespace App\Queries;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Builder;

class ReservationQueueQuery
{
    /**
     * @return Builder<Reservation>
     */
    public function pending(): Builder
    {
        return Reservation::query()
            ->with(['facility:id,name,location', 'user:id,nama'])
            ->where('status', ReservationStatus::Pending->value)
            ->oldest('start_time')
            ->oldest('id');
    }
}
