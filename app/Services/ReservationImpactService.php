<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReservationImpactService
{
    /**
     * @return array{rejected: int, cancelled: int}
     */
    public function deactivateUser(User $user): array
    {
        return DB::transaction(function () use ($user): array {
            $user = User::query()->whereKey($user->id)->lockForUpdate()->firstOrFail();
            $now = now();
            $unfinished = Reservation::query()
                ->where('user_id', $user->id)
                ->where('end_time', '>', $now)
                ->whereIn('status', [ReservationStatus::Pending->value, ReservationStatus::Approved->value])
                ->orderBy('id')
                ->lockForUpdate()
                ->get(['id', 'status']);

            $pendingIds = $unfinished
                ->filter(fn (Reservation $reservation): bool => $reservation->status === ReservationStatus::Pending)
                ->modelKeys();
            $approvedIds = $unfinished
                ->filter(fn (Reservation $reservation): bool => $reservation->status === ReservationStatus::Approved)
                ->modelKeys();

            $rejected = Reservation::query()->whereKey($pendingIds)->update([
                'status' => ReservationStatus::Rejected->value,
                'alasan_penolakan' => 'Reservasi ditolak karena akun pemesan dinonaktifkan oleh Admin.',
                'ditolak_pada' => $now,
            ]);
            $cancelled = Reservation::query()->whereKey($approvedIds)->update([
                'status' => ReservationStatus::Cancelled->value,
                'alasan_pembatalan' => 'Reservasi dibatalkan karena akun pemesan dinonaktifkan oleh Admin.',
            ]);

            $user->delete();

            return ['rejected' => $rejected, 'cancelled' => $cancelled];
        });
    }

    /**
     * @return array{rejected: int, cancelled: int}
     */
    public function applyDeactivation(Facility $facility): array
    {
        return DB::transaction(function () use ($facility): array {
            $facilityIds = [$facility->id];

            if ($facility->isRoom()) {
                $facilityIds = [...$facilityIds, ...$facility->childTools()->pluck('id')->all()];
            }

            $query = Reservation::query()
                ->whereIn('facility_id', $facilityIds)
                ->where('end_time', '>', now());

            return [
                'rejected' => (clone $query)
                    ->where('status', ReservationStatus::Pending->value)
                    ->update([
                        'status' => ReservationStatus::Rejected,
                        'alasan_penolakan' => 'Fasilitas dinonaktifkan dan tidak lagi tersedia untuk reservasi.',
                        'ditolak_pada' => now(),
                    ]),
                'cancelled' => $query
                    ->where('status', ReservationStatus::Approved->value)
                    ->update(['status' => ReservationStatus::Cancelled]),
            ];
        });
    }
}
