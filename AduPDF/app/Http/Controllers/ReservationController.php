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
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
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
}
