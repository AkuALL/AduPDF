<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Report;
use App\Models\Reservation;
use App\Models\User;
use App\Queries\DamageStatisticsQuery;
use App\Queries\ReservationStatisticsQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the Executive Admin Dashboard (DA-01, DA-02, DA-03, FR-19).
     *
     * Provides an informative governance overview without overlapping
     * Petugas operational approval/queue workflows.
     */
    public function index(
        Request $request,
        ReservationStatisticsQuery $reservationQuery,
        DamageStatisticsQuery $damageQuery,
    ): Response {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        // 1. Facilities Infrastructure Overview
        $totalFacilitiesCount = Facility::count();
        $activeFacilitiesCount = Facility::where('condition', FacilityCondition::Active->value)->count();
        $underRepairFacilitiesCount = Facility::where('condition', FacilityCondition::UnderRepair->value)->count();
        $inactiveFacilitiesCount = Facility::where('condition', FacilityCondition::Inactive->value)->count();

        $roomsCount = Facility::whereIn('type', [
            FacilityType::Classroom->value,
            FacilityType::Hall->value,
            FacilityType::Laboratory->value,
        ])->count();
        $toolsCount = Facility::where('type', FacilityType::Equipment->value)->count();
        $fieldsCount = Facility::where('type', FacilityType::Field->value)->count();

        // 2. Month-to-date Usage & Occupancy (AL-07 query + BR-21 enforcement)
        /** @var Collection<int, Reservation> $monthApprovedReservations */
        $monthApprovedReservations = $reservationQuery
            ->approvedOverlapping($startOfMonth, $endOfMonth)
            ->get();

        $totalMonthReservations = $monthApprovedReservations->count();
        $totalMonthMinutes = $monthApprovedReservations->sum(function (Reservation $reservation): int {
            return (int) $reservation->start_time->diffInMinutes($reservation->end_time);
        });
        $totalMonthHours = round($totalMonthMinutes / 60, 1);

        // Group reservations by facility for BR-21 counting
        $reservationsByFacility = $monthApprovedReservations->groupBy('facility_id');

        $allFacilities = Facility::with('parentFacility:id,name')->get();
        $topUsedFacilities = $allFacilities
            ->map(function (Facility $facility) use ($reservationsByFacility): array {
                /** @var Collection<int, Reservation> $resList */
                $resList = $reservationsByFacility->get($facility->id, collect());
                $minutes = $resList->sum(fn (Reservation $r): int => (int) $r->start_time->diffInMinutes($r->end_time));

                return [
                    'id' => $facility->id,
                    'name' => $facility->name,
                    'type' => $facility->type->value ?? (string) $facility->type,
                    'type_label' => match ($facility->type) {
                        FacilityType::Classroom => 'Ruang Kelas',
                        FacilityType::Hall => 'Aula',
                        FacilityType::Laboratory => 'Laboratorium',
                        FacilityType::Equipment => 'Alat',
                        FacilityType::Field => 'Lapangan',
                    },
                    'is_tool' => $facility->isTool(),
                    'parent_room' => $facility->parentFacility?->name,
                    'location' => $facility->location,
                    'condition' => $facility->condition->value ?? (string) $facility->condition,
                    'usage_count' => $resList->count(),
                    'usage_hours' => round($minutes / 60, 1),
                ];
            })
            ->filter(fn (array $item): bool => $item['usage_count'] > 0)
            ->sortByDesc('usage_count')
            ->take(5)
            ->values();

        // 3. Maintenance & Damage Hotspots (AB-06 contract)
        $monthDamageReportsCount = Report::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $underRepairList = Facility::with('parentFacility:id,name')
            ->where('condition', FacilityCondition::UnderRepair->value)
            ->orderBy('name')
            ->get()
            ->map(fn (Facility $facility): array => [
                'id' => $facility->id,
                'name' => $facility->name,
                'location' => $facility->location,
                'type' => $facility->type->value,
                'is_tool' => $facility->isTool(),
                'parent_room' => $facility->parentFacility?->name,
                'condition' => $facility->condition->value,
            ]);

        $damageStatsMonth = $damageQuery->byFacility($startOfMonth, $endOfMonth);
        $topDamagedFacilities = $damageStatsMonth->take(5)->map(fn ($item): array => [
            'id' => (int) $item->id,
            'name' => (string) $item->name,
            'location' => (string) $item->location,
            'report_count' => (int) $item->report_count,
        ]);

        $topDamagedLocations = $damageStatsMonth
            ->groupBy('location')
            ->map(fn ($items, string $loc): array => [
                'location' => $loc,
                'total_reports' => (int) $items->sum('report_count'),
                'facilities_count' => $items->count(),
            ])
            ->sortByDesc('total_reports')
            ->take(4)
            ->values();

        // 4. Governance & Account Statistics (GAL-01, GAL-06)
        $totalUsersCount = User::count();
        $activePenggunaCount = User::where('role', 'pengguna')->whereNull('deleted_at')->count();
        $activePetugasCount = User::where('role', 'petugas')->whereNull('deleted_at')->count();
        $adminCount = User::where('role', 'admin')->count();

        $data = [
            'month_label' => now()->locale('id')->translatedFormat('F Y'),
            'facility_stats' => [
                'total' => $totalFacilitiesCount,
                'active' => $activeFacilitiesCount,
                'under_repair' => $underRepairFacilitiesCount,
                'inactive' => $inactiveFacilitiesCount,
                'rooms' => $roomsCount,
                'tools' => $toolsCount,
                'fields' => $fieldsCount,
            ],
            'usage_stats' => [
                'total_reservations' => $totalMonthReservations,
                'total_hours' => $totalMonthHours,
                'top_used_facilities' => $topUsedFacilities->all(),
            ],
            'maintenance_stats' => [
                'month_reports_count' => $monthDamageReportsCount,
                'under_repair_count' => $underRepairFacilitiesCount,
                'under_repair_list' => $underRepairList->all(),
                'top_damaged_facilities' => $topDamagedFacilities->all(),
                'top_damaged_locations' => $topDamagedLocations->all(),
            ],
            'account_stats' => [
                'total_users' => $totalUsersCount,
                'pengguna_count' => $activePenggunaCount,
                'petugas_count' => $activePetugasCount,
                'admin_count' => $adminCount,
            ],
        ];

        return Inertia::render('admin/dashboard', $data);
    }
}
