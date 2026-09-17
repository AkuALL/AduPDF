<?php

namespace App\Services;

use App\Enums\FacilityCondition;
use App\Models\Facility;

class FacilityConditionService
{
    public function isReservable(Facility $facility): bool
    {
        if ($facility->condition !== FacilityCondition::Active) {
            return false;
        }

        if (! $facility->isTool()) {
            return true;
        }

        $parentFacility = $facility->parentFacility()->first();

        return $parentFacility !== null
            && $parentFacility->condition === FacilityCondition::Active;
    }

    public function updateCondition(Facility $facility, FacilityCondition $condition): Facility
    {
        $facility->update(['condition' => $condition]);

        return $facility->refresh();
    }
}
