<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class ReservationImpactService
{
    /**
     * @return array{rejected: int, cancelled: int}
     */
    public function applyDeactivation(Facility $facility): array
    {
        return DB::transaction(function () use ($facility): array {
            $facilityIds = [$facility->id];

            if ($facility->isRoom()) {
                $facilityIds = [...$facilityIds, ...$facility->childTools()->pluck('id')->all()];
            }

            $query = Reservation::query()
                ->whereIn('facility_id', $facilityIds)
                ->where('end_time', '>', now());

            return [
                'rejected' => (clone $query)
                    ->where('status', ReservationStatus::Pending->value)
                    ->update(['status' => ReservationStatus::Rejected]),
                'cancelled' => $query
                    ->where('status', ReservationStatus::Approved->value)
                    ->update(['status' => ReservationStatus::Cancelled]),
            ];
        });
    }
}
