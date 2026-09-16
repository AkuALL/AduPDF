<?php

namespace App\Http\Controllers;

use App\Enums\ReservationStatus;
use App\Http\Requests\StoreReservationRequest;
use App\Models\Facility;
use App\Models\Reservation;
use App\Services\FacilityConditionService;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $reservations = Reservation::query()
            ->with('facility:id,name,location')
            ->where('user_id', $request->user()->id)
            ->latest('start_time')
            ->latest('id')
            ->get()
            ->map(fn (Reservation $reservation): array => $this->reservationData($reservation))
            ->values();

        return Inertia::render('reservations/index', [
            'reservations' => $reservations,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function create(Request $request, FacilityConditionService $conditions): Response
    {
        $input = $request->validate(['facility_id' => ['required', 'integer', 'exists:facilities,id']]);
        $facility = Facility::query()->whereKey($input['facility_id'])->firstOrFail();

        return Inertia::render('reservations/create', [
            'facility' => $facility->only(['id', 'name', 'location']),
            'reservable' => $conditions->isReservable($facility),
            'success' => $request->session()->get('success'),
        ]);
    }

    public function store(StoreReservationRequest $request): RedirectResponse
    {
        $input = $request->validated();

        Reservation::create([
            'user_id' => $request->user()->id,
            'facility_id' => $input['facility_id'],
            'tujuan' => $input['tujuan'],
            'start_time' => CarbonImmutable::parse($input['start_time'], 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
            'end_time' => CarbonImmutable::parse($input['end_time'], 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
            'status' => ReservationStatus::Pending,
        ]);

        return redirect()->route('reservations.create', ['facility_id' => $input['facility_id']])
            ->with('success', 'Pengajuan reservasi berhasil dikirim dan menunggu persetujuan Petugas.');
    }

    public function show(Request $request, Reservation $reservation): Response
    {
        $this->ensureOwner($request, $reservation);
        $reservation->load('facility:id,name,location');

        return Inertia::render('reservations/show', [
            'reservation' => $this->reservationData($reservation),
            'can_cancel' => $this->canCancel($reservation),
            'success' => $request->session()->get('success'),
        ]);
    }

    public function cancel(Request $request, Reservation $reservation): RedirectResponse
    {
        $this->ensureOwner($request, $reservation);

        if (! $this->canCancel($reservation)) {
            throw ValidationException::withMessages([
                'reservation' => 'Reservasi hanya dapat dibatalkan hingga tepat 48 jam sebelum waktu mulai.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::Cancelled]);

        return redirect()->route('reservations.show', $reservation)
            ->with('success', 'Reservasi berhasil dibatalkan.');
    }

    private function ensureOwner(Request $request, Reservation $reservation): void
    {
        abort_unless((int) $reservation->user_id === (int) $request->user()->id, 403);
    }

    private function canCancel(Reservation $reservation): bool
    {
        return in_array($reservation->status, [ReservationStatus::Pending, ReservationStatus::Approved], true)
            && now()->lessThanOrEqualTo($reservation->start_time->copy()->subHours(48));
    }

    /**
     * @return array<string, int|string|null|array<string, int|string>>
     */
    private function reservationData(Reservation $reservation): array
    {
        return [
            'id' => $reservation->id,
            'tujuan' => $reservation->tujuan,
            'start_time' => $reservation->start_time->setTimezone('Asia/Jakarta')->format('d M Y, H:i'),
            'end_time' => $reservation->end_time->setTimezone('Asia/Jakarta')->format('d M Y, H:i'),
            'status' => $reservation->status->value,
            'alasan_pembatalan' => $reservation->alasan_pembatalan,
            'facility' => [
                'id' => $reservation->facility->id,
                'name' => $reservation->facility->name,
                'location' => $reservation->facility->location,
            ],
        ];
    }
}
