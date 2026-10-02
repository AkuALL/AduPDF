<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Reservation;
use App\Queries\DamageStatisticsQuery;
use App\Queries\ReservationStatisticsQuery;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RecapController extends Controller
{
    /**
     * Display the Admin recap of facility occupancy and damage frequencies (DA-03, FR-19, BR-21).
     */
    public function index(
        Request $request,
        ReservationStatisticsQuery $reservationQuery,
        DamageStatisticsQuery $damageQuery,
    ): View|Response {
        $recapData = $this->buildRecapData($request, $reservationQuery, $damageQuery);

        if ($request->header('X-Inertia') || $request->wantsJson()) {
            return Inertia::render('admin/recap/index', $recapData);
        }

        return view('admin.recap.index', $recapData);
    }

    /**
     * Export the recap to CSV or return an informative error for unsupported formats (DA-04, FR-19).
     */
    public function export(
        Request $request,
        ReservationStatisticsQuery $reservationQuery,
        DamageStatisticsQuery $damageQuery,
    ): StreamedResponse|HttpResponse|RedirectResponse {
        $format = strtolower($request->query('format', 'csv'));

        if (! in_array($format, ['csv'], true)) {
            $message = sprintf(
                'Format ekspor "%s" belum didukung. Silakan gunakan format CSV untuk mengunduh rekap secara instan.',
                strtoupper($format)
            );

            if ($request->wantsJson()) {
                return response()->json(['error' => $message], 422);
            }

            return back()->with('error', $message);
        }

        $recapData = $this->buildRecapData($request, $reservationQuery, $damageQuery);
        $filename = sprintf('rekap-okupansi-kerusakan-adupdf-%s.csv', now()->format('Ymd_His'));

        return response()->streamDownload(function () use ($recapData): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            // UTF-8 BOM for Microsoft Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Section 1: Header metadata
            fputcsv($handle, ['=== REKAPITULASI OKUPANSI & KERUSAKAN FASILITAS (ADUPDF) ===']);
            fputcsv($handle, ['Tanggal Cetak', now()->setTimezone('Asia/Jakarta')->format('d F Y, H:i').' WIB']);
            fputcsv($handle, ['Periode Filter', $recapData['filter_label']]);
            fputcsv($handle, ['Rentang Waktu', $recapData['start_date']->format('d/m/Y').' s/d '.$recapData['end_date']->format('d/m/Y')]);
            fputcsv($handle, ['Total Fasilitas Terdata', count($recapData['facilities'])]);
            fputcsv($handle, ['Total Reservasi Disetujui', $recapData['summary']['total_reservations']]);
            fputcsv($handle, ['Total Jam Penggunaan', $recapData['summary']['total_hours_used'].' Jam']);
            fputcsv($handle, ['Total Laporan Kerusakan', $recapData['summary']['total_damage_reports']]);
            fputcsv($handle, []);

            // Rule BR-21 Note
            fputcsv($handle, ['=== CATATAN ATURAN BISNIS BR-21 ===']);
            fputcsv($handle, ['Reservasi penuh ruangan dihitung sebagai penggunaan ruangan.']);
            fputcsv($handle, ['Penggunaan individual alat hanya dihitung dari reservasi alat yang dilakukan secara eksplisit.']);
            fputcsv($handle, []);

            // Section 2: Facility Occupancy & Usage Table
            fputcsv($handle, ['--- BAGIAN 1: REKAP OKUPANSI & PENGGUNAAN FASILITAS ---']);
            fputcsv($handle, [
                'ID',
                'Nama Fasilitas',
                'Tipe',
                'Ruangan Induk (Khusus Alat)',
                'Lokasi',
                'Kapasitas',
                'Kondisi Saat Ini',
                'Jumlah Reservasi Disetujui',
                'Total Durasi (Jam)',
                'Pengguna Unik',
                'Estimasi Tingkat Okupansi (%)',
            ]);

            foreach ($recapData['facilities'] as $facility) {
                fputcsv($handle, [
                    $facility['id'],
                    $facility['name'],
                    $facility['type_label'],
                    $facility['parent_room_name'] ?? '—',
                    $facility['location'],
                    $facility['capacity'],
                    $facility['condition_label'],
                    $facility['usage_count'],
                    $facility['usage_hours'],
                    $facility['unique_users_count'],
                    $facility['occupancy_rate'].'%',
                ]);
            }
            fputcsv($handle, []);

            // Section 3: Damage Frequency per Facility
            fputcsv($handle, ['--- BAGIAN 2: FREKUENSI KERUSAKAN PER FASILITAS ---']);
            fputcsv($handle, [
                'ID Fasilitas',
                'Nama Fasilitas',
                'Lokasi',
                'Kondisi',
                'Jumlah Laporan Kerusakan',
            ]);

            foreach ($recapData['damage_by_facility'] as $damage) {
                fputcsv($handle, [
                    $damage['id'],
                    $damage['name'],
                    $damage['location'],
                    $damage['condition_label'] ?? '—',
                    $damage['report_count'],
                ]);
            }
            fputcsv($handle, []);

            // Section 4: Damage Frequency per Location
            fputcsv($handle, ['--- BAGIAN 3: FREKUENSI KERUSAKAN PER LOKASI ---']);
            fputcsv($handle, [
                'Lokasi / Gedung',
                'Jumlah Fasilitas',
                'Total Laporan Kerusakan',
            ]);

            foreach ($recapData['damage_by_location'] as $location) {
                fputcsv($handle, [
                    $location['location'],
                    $location['facilities_count'],
                    $location['total_reports'],
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => sprintf('attachment; filename="%s"', $filename),
        ]);
    }

    /**
     * Compute and assemble analytical recap data.
     *
     * @return array<string, mixed>
     */
    private function buildRecapData(
        Request $request,
        ReservationStatisticsQuery $reservationQuery,
        DamageStatisticsQuery $damageQuery,
    ): array {
        [$startDate, $endDate, $period, $filterLabel] = $this->resolveDateRange($request);

        // Fetch approved reservations in date range via AL-07 contract
        /** @var Collection<int, Reservation> $approvedReservations */
        $approvedReservations = $reservationQuery
            ->approvedOverlapping($startDate, $endDate)
            ->get();

        // Fetch damage statistics via AB-06 contract
        /** @var Collection<int, object{id: int, name: string, location: string, report_count: int}> $damageStatsRaw */
        $damageStatsRaw = $damageQuery->byFacility($startDate, $endDate);
        $damageStatsByFacilityId = $damageStatsRaw->keyBy('id');

        // Query facilities with filters
        $facilityTypeFilter = $request->query('facility_type');
        $locationFilter = $request->query('location');
        $searchFilter = $request->query('search');

        $facilities = Facility::query()
            ->with(['parentFacility:id,name', 'childTools:id,parent_facility_id'])
            ->when($facilityTypeFilter, function ($query, string $type): void {
                $query->where('type', $type);
            })
            ->when($locationFilter, function ($query, string $loc): void {
                $query->where('location', 'like', '%'.$loc.'%');
            })
            ->when($searchFilter, function ($query, string $search): void {
                $query->where('name', 'like', '%'.$search.'%');
            })
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        // Calculate available operational hours for the selected period
        // Operational hours: 07:00 to 20:00 (13 hours / 780 minutes per operational day)
        $diffInDays = max(1, $startDate->copy()->startOfDay()->diffInDays($endDate->copy()->startOfDay()) + 1);
        $totalOperationalMinutes = $diffInDays * 13 * 60;

        // Group approved reservations by reserved facility (BR-21 enforcement)
        $reservationsByFacility = $approvedReservations->groupBy('facility_id');

        $formattedFacilities = $facilities->map(function (Facility $facility) use (
            $reservationsByFacility,
            $damageStatsByFacilityId,
            $totalOperationalMinutes
        ): array {
            /** @var Collection<int, Reservation> $facilityReservations */
            $facilityReservations = $reservationsByFacility->get($facility->id, collect());

            // BR-21: Explicit reservation counting
            // - Room reservation counts strictly towards the room.
            // - Tool reservation counts strictly towards the tool (explicitly).
            $usageCount = $facilityReservations->count();

            $totalDurationMinutes = $facilityReservations->sum(function (Reservation $reservation): int {
                return (int) $reservation->start_time->diffInMinutes($reservation->end_time);
            });

            $usageHours = round($totalDurationMinutes / 60, 1);
            $uniqueUsersCount = $facilityReservations->pluck('user_id')->unique()->count();

            // Occupancy rate calculation (capped at 100%)
            $occupancyRate = $totalOperationalMinutes > 0
                ? min(100.0, round(($totalDurationMinutes / $totalOperationalMinutes) * 100, 1))
                : 0.0;

            $damageCount = $damageStatsByFacilityId->has($facility->id)
                ? (int) $damageStatsByFacilityId->get($facility->id)->report_count
                : 0;

            return [
                'id' => $facility->id,
                'name' => $facility->name,
                'type' => $facility->type->value ?? (string) $facility->type,
                'type_label' => $this->formatFacilityType($facility->type),
                'is_tool' => $facility->isTool(),
                'is_room' => $facility->isRoom(),
                'parent_room_name' => $facility->parentFacility?->name,
                'location' => $facility->location,
                'capacity' => $facility->capacity,
                'condition' => $facility->condition->value ?? (string) $facility->condition,
                'condition_label' => $this->formatCondition($facility->condition),
                'usage_count' => $usageCount,
                'usage_duration_minutes' => $totalDurationMinutes,
                'usage_hours' => $usageHours,
                'unique_users_count' => $uniqueUsersCount,
                'occupancy_rate' => $occupancyRate,
                'damage_count' => $damageCount,
            ];
        })->values();

        // Damage summary by facility
        $damageByFacility = $damageStatsRaw->map(function ($item): array {
            $facility = Facility::find($item->id);

            return [
                'id' => (int) $item->id,
                'name' => (string) $item->name,
                'location' => (string) $item->location,
                'report_count' => (int) $item->report_count,
                'condition' => $facility?->condition->value ?? 'aktif',
                'condition_label' => $facility ? $this->formatCondition($facility->condition) : 'Aktif',
                'type_label' => $facility ? $this->formatFacilityType($facility->type) : 'Fasilitas',
            ];
        })->values();

        // Damage summary grouped by location
        $damageByLocation = $damageStatsRaw
            ->groupBy('location')
            ->map(function ($items, string $location): array {
                return [
                    'location' => $location,
                    'total_reports' => (int) $items->sum('report_count'),
                    'facilities_count' => $items->count(),
                ];
            })
            ->sortByDesc('total_reports')
            ->values();

        // Summary KPIs
        $totalReservations = $approvedReservations->count();
        $totalMinutesUsed = $approvedReservations->sum(function (Reservation $res): int {
            return (int) $res->start_time->diffInMinutes($res->end_time);
        });
        $totalHoursUsed = round($totalMinutesUsed / 60, 1);
        $totalDamageReports = (int) $damageStatsRaw->sum('report_count');

        $mostUsedFacility = $formattedFacilities->sortByDesc('usage_count')->first();
        $mostDamagedFacility = $damageByFacility->sortByDesc('report_count')->first();
        $mostDamagedLocation = $damageByLocation->first();

        $availableLocations = Facility::query()
            ->select('location')
            ->distinct()
            ->orderBy('location')
            ->pluck('location')
            ->filter()
            ->values()
            ->all();

        return [
            'period' => $period,
            'filter_label' => $filterLabel,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'start_date_input' => $startDate->format('Y-m-d'),
            'end_date_input' => $endDate->format('Y-m-d'),
            'facility_type_filter' => $facilityTypeFilter,
            'location_filter' => $locationFilter,
            'search_filter' => $searchFilter,
            'summary' => [
                'total_reservations' => $totalReservations,
                'total_hours_used' => $totalHoursUsed,
                'total_damage_reports' => $totalDamageReports,
                'avg_occupancy_rate' => $formattedFacilities->count() > 0 ? round($formattedFacilities->avg('occupancy_rate'), 1) : 0,
                'most_used_facility' => $mostUsedFacility && $mostUsedFacility['usage_count'] > 0 ? $mostUsedFacility['name'] : 'Belum ada',
                'most_used_count' => $mostUsedFacility ? $mostUsedFacility['usage_count'] : 0,
                'most_damaged_facility' => $mostDamagedFacility && $mostDamagedFacility['report_count'] > 0 ? $mostDamagedFacility['name'] : 'Tidak ada',
                'most_damaged_count' => $mostDamagedFacility ? $mostDamagedFacility['report_count'] : 0,
                'most_damaged_location' => $mostDamagedLocation && $mostDamagedLocation['total_reports'] > 0 ? $mostDamagedLocation['location'] : 'Tidak ada',
            ],
            'facilities' => $formattedFacilities->all(),
            'damage_by_facility' => $damageByFacility->all(),
            'damage_by_location' => $damageByLocation->all(),
            'available_locations' => $availableLocations,
            'facility_types' => [
                ['value' => FacilityType::Classroom->value, 'label' => 'Ruang Kelas'],
                ['value' => FacilityType::Hall->value, 'label' => 'Aula'],
                ['value' => FacilityType::Laboratory->value, 'label' => 'Laboratorium'],
                ['value' => FacilityType::Equipment->value, 'label' => 'Alat'],
                ['value' => FacilityType::Field->value, 'label' => 'Lapangan'],
            ],
        ];
    }

    /**
     * Resolve date range from request filter.
     *
     * @return array{0: CarbonInterface, 1: CarbonInterface, 2: string, 3: string}
     */
    private function resolveDateRange(Request $request): array
    {
        $period = $request->query('period', 'this_month');

        if ($period === 'last_month') {
            $startDate = now()->subMonth()->startOfMonth();
            $endDate = now()->subMonth()->endOfMonth();
            $label = 'Bulan Lalu ('.$startDate->locale('id')->translatedFormat('F Y').')';
        } elseif ($period === 'last_30_days') {
            $startDate = now()->subDays(30)->startOfDay();
            $endDate = now()->endOfDay();
            $label = '30 Hari Terakhir';
        } elseif ($period === 'last_90_days') {
            $startDate = now()->subDays(90)->startOfDay();
            $endDate = now()->endOfDay();
            $label = '90 Hari Terakhir';
        } elseif ($period === 'all') {
            $startDate = Carbon::create(2020, 1, 1, 0, 0, 0);
            $endDate = now()->addYear()->endOfDay();
            $label = 'Semua Waktu';
        } elseif ($period === 'custom' && $request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
            $label = 'Kustom ('.$startDate->format('d/m/Y').' – '.$endDate->format('d/m/Y').')';
        } else {
            $period = 'this_month';
            $startDate = now()->startOfMonth();
            $endDate = now()->endOfMonth();
            $label = 'Bulan Ini ('.$startDate->locale('id')->translatedFormat('F Y').')';
        }

        return [$startDate, $endDate, $period, $label];
    }

    private function formatFacilityType(FacilityType $type): string
    {
        return match ($type) {
            FacilityType::Classroom => 'Ruang Kelas',
            FacilityType::Hall => 'Aula',
            FacilityType::Laboratory => 'Laboratorium',
            FacilityType::Equipment => 'Alat',
            FacilityType::Field => 'Lapangan',
        };
    }

    private function formatCondition(FacilityCondition $condition): string
    {
        return match ($condition) {
            FacilityCondition::Active => 'Aktif',
            FacilityCondition::UnderRepair => 'Dalam Perbaikan',
            FacilityCondition::Inactive => 'Nonaktif',
        };
    }
}
