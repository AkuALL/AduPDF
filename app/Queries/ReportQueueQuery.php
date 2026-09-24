<?php

namespace App\Queries;

use App\Enums\ReportStatus;
use App\Models\Report;
use Illuminate\Database\Eloquent\Builder;

class ReportQueueQuery
{
    /**
     * @return Builder<Report>
     */
    public function newReports(): Builder
    {
        return Report::query()
            ->with(['facility:id,name,location,condition', 'user:id,nama'])
            ->where('status_laporan', ReportStatus::New->value)
            ->oldest()
            ->oldest('id');
    }
}
