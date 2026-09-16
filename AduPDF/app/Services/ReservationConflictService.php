<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;

class ReservationConflictService
{
    public function hasConflict(User $user, Facility $facility, CarbonInterface $startTime, CarbonInterface $endTime): bool
    {
        $overlapping = Reservation::query()
            ->with('facility:id,type,parent_facility_id')
            ->where('status', ReservationStatus::Approved->value)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->where(function (Builder $query) use ($user, $facility): void {
                $query->where('user_id', $user->id)
                    ->orWhere('facility_id', $facility->id);

                if ($facility->isTool()) {
                    $query->orWhere('facility_id', $facility->parent_facility_id);
                } elseif ($facility->isRoom()) {
                    $query->orWhereHas('facility', fn (Builder $facilityQuery): Builder => $facilityQuery->where('parent_facility_id', $facility->id));
                }
            })
            ->get();

        foreach ($overlapping as $reservation) {
            if ((int) $reservation->facility_id === (int) $facility->id) {
                return true;
            }

            if ($facility->isTool() && (int) $reservation->facility_id === (int) $facility->parent_facility_id) {
                return true;
            }

            if ($facility->isRoom() && (int) $reservation->facility?->parent_facility_id === (int) $facility->id) {
                return true;
            }

            if ((int) $reservation->user_id === (int) $user->id) {
                $sameRoomTools = $facility->isTool()
                    && $reservation->facility?->isTool()
                    && (int) $reservation->facility->parent_facility_id === (int) $facility->parent_facility_id;

                if (! $sameRoomTools) {
                    return true;
                }
            }
        }

        return false;
    }
}
