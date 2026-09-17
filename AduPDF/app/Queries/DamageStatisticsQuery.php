<?php

namespace App\Queries;

use App\Models\Report;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class DamageStatisticsQuery
{
    /**
     * @return Collection<int, object{id: int, name: string, location: string, report_count: int}>
     */
    public function byFacility(?CarbonInterface $startDate = null, ?CarbonInterface $endDate = null): Collection
    {
        return Report::query()
            ->join('facilities', 'reports.facility_id', '=', 'facilities.id')
            ->selectRaw('facilities.id, facilities.name, facilities.location, count(reports.id) as report_count')
            ->when($startDate, fn ($query) => $query->where('reports.created_at', '>=', $startDate))
            ->when($endDate, fn ($query) => $query->where('reports.created_at', '<=', $endDate))
            ->groupBy('facilities.id', 'facilities.name', 'facilities.location')
            ->orderByDesc('report_count')
            ->orderBy('facilities.name')
            ->get();
    }
}
