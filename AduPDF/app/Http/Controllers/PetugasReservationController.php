<?php

namespace App\Http\Controllers;

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use App\Services\FacilityConditionService;
use App\Services\ReservationConflictService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PetugasReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $reservations = Reservation::query()
            ->with(['facility:id,name,location', 'user:id,nama'])
            ->where('status', ReservationStatus::Pending->value)
            ->oldest('start_time')
            ->oldest('id')
            ->get()
            ->map(fn (Reservation $reservation): array => [
                'id' => $reservation->id,
                'user' => $reservation->user->name,
                'facility' => $reservation->facility->name,
                'location' => $reservation->facility->location,
                'tujuan' => $reservation->tujuan,
                'start_time' => $reservation->start_time->setTimezone('Asia/Jakarta')->format('d M Y, H:i'),
                'end_time' => $reservation->end_time->setTimezone('Asia/Jakarta')->format('d M Y, H:i'),
            ])
            ->values();

        return Inertia::render('petugas/reservations/index', [
            'reservations' => $reservations,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function approve(
        Reservation $reservation,
        FacilityConditionService $conditions,
        ReservationConflictService $conflicts,
    ): RedirectResponse {
        $rejectedCount = DB::transaction(function () use ($reservation, $conditions, $conflicts): int {
            $reservation = Reservation::query()
                ->with(['facility:id,type,condition,parent_facility_id', 'user:id'])
                ->whereKey($reservation->id)
                ->firstOrFail();

            Facility::query()
                ->whereIn('id', array_filter([$reservation->facility_id, $reservation->facility->parent_facility_id]))
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            User::query()->whereKey($reservation->user_id)->lockForUpdate()->firstOrFail();

            $reservation = Reservation::query()
                ->with(['facility:id,type,condition,parent_facility_id', 'user:id'])
                ->whereKey($reservation->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($reservation->status !== ReservationStatus::Pending) {
                throw ValidationException::withMessages(['reservation' => 'Reservasi ini tidak lagi menunggu keputusan.']);
            }

            if (! $conditions->isReservable($reservation->facility)) {
                throw ValidationException::withMessages(['reservation' => 'Fasilitas tidak lagi dapat direservasi.']);
            }

            if ($conflicts->hasConflict($reservation->user, $reservation->facility, $reservation->start_time, $reservation->end_time, true)) {
                throw ValidationException::withMessages(['reservation' => 'Reservasi berbenturan dengan reservasi yang telah disetujui.']);
            }

            $reservation->update(['status' => ReservationStatus::Approved]);
            $conflictingIds = $conflicts->pendingConflicts($reservation)->pluck('id');

            Reservation::query()
                ->whereIn('id', $conflictingIds)
                ->update(['status' => ReservationStatus::Rejected]);

            return $conflictingIds->count();
        });

        $message = 'Reservasi berhasil disetujui.';
        if ($rejectedCount > 0) {
            $message .= " {$rejectedCount} pengajuan yang berbenturan otomatis ditolak.";
        }

        return redirect()->route('petugas.reservations.index')->with('success', $message);
    }

    public function reject(Reservation $reservation): RedirectResponse
    {
        $updated = Reservation::query()
            ->whereKey($reservation->id)
            ->where('status', ReservationStatus::Pending->value)
            ->update(['status' => ReservationStatus::Rejected]);

        if ($updated === 0) {
            throw ValidationException::withMessages(['reservation' => 'Reservasi ini tidak lagi menunggu keputusan.']);
        }

        return redirect()->route('petugas.reservations.index')
            ->with('success', 'Reservasi berhasil ditolak.');
    }
}
