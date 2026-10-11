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
use Illuminate\Support\Facades\DB;
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
            'server_now' => CarbonImmutable::now('Asia/Jakarta')->toIso8601String(),
        ]);
    }

    public function store(StoreReservationRequest $request): RedirectResponse
    {
        $input = $request->validated();
        $rawSchedules = $request->input('schedules');
        $schedules = ! empty($rawSchedules) ? json_decode($rawSchedules, true) : null;

        if (is_array($schedules) && count($schedules) > 0) {
            DB::transaction(function () use ($request, $input, $schedules) {
                foreach ($schedules as $sched) {
                    Reservation::create([
                        'user_id' => $request->user()->id,
                        'facility_id' => $input['facility_id'],
                        'tujuan' => $input['tujuan'],
                        'start_time' => CarbonImmutable::parse("{$sched['date']}T{$sched['start_time']}", 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
                        'end_time' => CarbonImmutable::parse("{$sched['date']}T{$sched['end_time']}", 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
                        'status' => ReservationStatus::Pending,
                    ]);
                }
            });
        } else {
            Reservation::create([
                'user_id' => $request->user()->id,
                'facility_id' => $input['facility_id'],
                'tujuan' => $input['tujuan'],
                'start_time' => CarbonImmutable::parse($input['start_time'], 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
                'end_time' => CarbonImmutable::parse($input['end_time'], 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
                'status' => ReservationStatus::Pending,
            ]);
        }

        return redirect()->route('reservations.create', ['facility_id' => $input['facility_id']])
            ->with('success', 'Pengajuan reservasi berhasil dikirim dan menunggu persetujuan Petugas.')
            ->withoutCookie('pending_reservation');
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

        if ($reservation->status !== ReservationStatus::Pending) {
            throw ValidationException::withMessages([
                'reservation' => 'Hanya reservasi yang berstatus Menunggu yang dapat dibatalkan.',
            ]);
        }

        if (! $this->canCancel($reservation)) {
            throw ValidationException::withMessages([
                'reservation' => 'Pembatalan reservasi tidak dapat dilakukan karena sudah melewati batas 48 jam sebelum jadwal dimulai.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::Cancelled]);

        return back()->with('success', 'Reservasi berhasil dibatalkan.');
    }

    private function ensureOwner(Request $request, Reservation $reservation): void
    {
        abort_unless((int) $reservation->user_id === (int) $request->user()->id, 403);
    }

    private function canCancel(Reservation $reservation): bool
    {
        if ($reservation->status !== ReservationStatus::Pending) {
            return false;
        }

        return now()->addHours(48)->lte($reservation->start_time);
    }

    /**
     * @return array<string, int|string|null|bool|array<string, int|string>>
     */
    private function reservationData(Reservation $reservation): array
    {
        return [
            'id' => $reservation->id,
            'tujuan' => $reservation->tujuan,
            'start_time' => $reservation->start_time->setTimezone('Asia/Jakarta')->locale('id')->translatedFormat('d F Y, H:i'),
            'end_time' => $reservation->end_time->setTimezone('Asia/Jakarta')->locale('id')->translatedFormat('d F Y, H:i'),
            'status' => $reservation->status->value,
            'alasan_penolakan' => $reservation->alasan_penolakan,
            'ditolak_pada' => $reservation->ditolak_pada?->setTimezone('Asia/Jakarta')->locale('id')->translatedFormat('d F Y, H:i'),
            'alasan_pembatalan' => $reservation->alasan_pembatalan,
            'can_cancel' => $this->canCancel($reservation),
            'facility' => [
                'id' => $reservation->facility->id,
                'name' => $reservation->facility->name,
                'location' => $reservation->facility->location,
            ],
        ];
    }
}
