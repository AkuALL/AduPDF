<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $facility_id
 * @property string $tujuan
 * @property Carbon $start_time
 * @property Carbon $end_time
 * @property ReservationStatus $status
 * @property string|null $alasan_pembatalan
 */
#[Fillable(['user_id', 'facility_id', 'tujuan', 'start_time', 'end_time', 'status', 'alasan_pembatalan'])]
class Reservation extends Model
{
    /**
     * Get the user who made this reservation.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reserved facility.
     *
     * @return BelongsTo<Facility, $this>
     */
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'status' => ReservationStatus::class,
        ];
    }
}
