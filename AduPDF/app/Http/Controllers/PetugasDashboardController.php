<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Reservation;
use App\Queries\ReportQueueQuery;
use App\Queries\ReservationQueueQuery;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class PetugasDashboardController extends Controller
{
    /**
     * Display the operational Petugas Dashboard (DA-02, FR-09).
     *
     * Consumes reservation queue from AL-07 and report queue from AB-06.
     * Segments reservation queue by time slot: nearest slot first, and FIFO (created_at ASC) inside each segment.
     */
    public function index(
        Request $request,
        ReservationQueueQuery $reservationQueue,
        ReportQueueQuery $reportQueue,
    ): View|Response {
        $pendingReservations = $reservationQueue->pending()->get();
        $newReports = $reportQueue->newReports()->get();

        // Segmen slot waktu: slot terdekat dari waktu sekarang lebih dahulu,
        // lalu di dalam setiap segmen diurutkan created_at ASC (FIFO).
        $reservationSegments = $pendingReservations
            ->groupBy(function (Reservation $reservation): string {
                $start = $reservation->start_time->setTimezone('Asia/Jakarta');
                $end = $reservation->end_time->setTimezone('Asia/Jakarta');

                return $start->format('Y-m-d H:i').'_'.$end->format('H:i');
            })
            ->map(function ($reservations, string $slotKey): array {
                /** @var Reservation $first */
                $first = $reservations->first();
                $start = $first->start_time->setTimezone('Asia/Jakarta');
                $end = $first->end_time->setTimezone('Asia/Jakarta');

                $dayNames = [
                    0 => 'Minggu',
                    1 => 'Senin',
                    2 => 'Selasa',
                    3 => 'Rabu',
                    4 => 'Kamis',
                    5 => 'Jumat',
                    6 => 'Sabtu',
                ];
                $dayName = $dayNames[(int) $start->format('w')] ?? '';
                $slotLabel = $dayName.', '.$start->format('d M Y').' · '.$start->format('H:i').' – '.$end->format('H:i').' WIB';

                return [
                    'slot_key' => $slotKey,
                    'slot_label' => $slotLabel,
                    'start_time' => $start->format('d M Y, H:i'),
                    'end_time' => $end->format('H:i'),
                    'count' => $reservations->count(),
                    'reservations' => $reservations->map(fn (Reservation $reservation): array => [
                        'id' => $reservation->id,
                        'user_name' => $reservation->user->nama ?? $reservation->user->name ?? 'Pengguna',
                        'facility_name' => $reservation->facility->name,
                        'facility_location' => $reservation->facility->location,
                        'tujuan' => $reservation->tujuan,
                        'status' => $reservation->status->value ?? (string) $reservation->status,
                        'created_at' => $reservation->created_at?->setTimezone('Asia/Jakarta')->format('d M Y, H:i') ?? '—',
                        'created_at_human' => $reservation->created_at?->diffForHumans() ?? '—',
                    ])->values()->all(),
                ];
            })
            ->values();

        $formattedReports = $newReports->map(fn (Report $report): array => [
            'id' => $report->id,
            'kategori' => $report->kategori,
            'deskripsi' => $report->deskripsi,
            'reporter_name' => $report->user->nama ?? $report->user->name ?? 'Pengguna',
            'facility_name' => $report->facility->name,
            'facility_location' => $report->facility->location,
            'facility_condition' => $report->facility->condition->value ?? (string) $report->facility->condition,
            'status' => $report->status_laporan->value ?? (string) $report->status_laporan,
            'created_at' => $report->created_at?->setTimezone('Asia/Jakarta')->format('d M Y, H:i') ?? '—',
            'created_at_human' => $report->created_at?->diffForHumans() ?? '—',
        ])->values()->all();

        $data = [
            'pending_reservations_count' => $pendingReservations->count(),
            'new_reports_count' => $newReports->count(),
            'reservation_segments' => $reservationSegments->all(),
            'reports' => $formattedReports,
        ];

        if ($request->header('X-Inertia') || $request->wantsJson()) {
            return Inertia::render('petugas/dashboard', $data);
        }

        return view('petugas.dashboard', $data);
    }
}
