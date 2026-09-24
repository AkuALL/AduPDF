<?php

namespace App\Http\Requests;

use App\Models\Facility;
use App\Services\FacilityConditionService;
use App\Services\ReservationConflictService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isPengguna() && $this->user()->isApproved();
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'integer', 'exists:facilities,id'],
            'tujuan' => ['required', 'string', 'max:5000'],
            'start_time' => ['required', 'date_format:Y-m-d\TH:i'],
            'end_time' => ['required', 'date_format:Y-m-d\TH:i'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $facility = Facility::query()->whereKey($this->integer('facility_id'))->firstOrFail();

                if (! app(FacilityConditionService::class)->isReservable($facility)) {
                    $validator->errors()->add('facility_id', 'Fasilitas ini tidak dapat direservasi.');

                    return;
                }

                $startTime = CarbonImmutable::parse($this->string('start_time')->toString(), 'Asia/Jakarta');
                $endTime = CarbonImmutable::parse($this->string('end_time')->toString(), 'Asia/Jakarta');

                if ($startTime->lessThanOrEqualTo(CarbonImmutable::now('Asia/Jakarta')) || $endTime->lessThanOrEqualTo($startTime)) {
                    $validator->errors()->add('start_time', 'Waktu reservasi harus di masa depan dan waktu selesai harus setelah waktu mulai.');

                    return;
                }

                if ($startTime->greaterThan(CarbonImmutable::now('Asia/Jakarta')->addDays(90))) {
                    $validator->errors()->add('start_time', 'Reservasi hanya dapat diajukan maksimal 90 hari ke depan.');

                    return;
                }

                if (! $startTime->isSameDay($endTime)
                    || $startTime->format('H:i') < '07:00'
                    || $endTime->format('H:i') > '20:00'
                    || ! in_array($startTime->minute, [0, 30], true)
                    || ! in_array($endTime->minute, [0, 30], true)) {
                    $validator->errors()->add('start_time', 'Pilih slot 30 menit pada hari yang sama antara 07:00 dan 20:00 WIB.');

                    return;
                }

                if (app(ReservationConflictService::class)->hasConflict(
                    $this->user(),
                    $facility,
                    $startTime->utc(),
                    $endTime->utc(),
                )) {
                    $validator->errors()->add('start_time', 'Waktu tersebut bentrok dengan reservasi yang sudah disetujui.');
                }
            },
        ];
    }
}
