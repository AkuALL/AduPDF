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
        $user = $this->user();

        return $user?->isPengguna() === true
            && $user->isActive()
            && $user->isApproved();
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
            'schedules' => ['nullable', 'string'],
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

                $rawSchedules = $this->string('schedules')->toString();
                $schedulesList = [];
                if (! empty($rawSchedules)) {
                    $decoded = json_decode($rawSchedules, true);
                    if (is_array($decoded) && count($decoded) > 0) {
                        $schedulesList = $decoded;
                    }
                }

                if (empty($schedulesList)) {
                    $schedulesList = [
                        [
                            'date' => CarbonImmutable::parse($this->string('start_time')->toString(), 'Asia/Jakarta')->format('Y-m-d'),
                            'start_time' => CarbonImmutable::parse($this->string('start_time')->toString(), 'Asia/Jakarta')->format('H:i'),
                            'end_time' => CarbonImmutable::parse($this->string('end_time')->toString(), 'Asia/Jakarta')->format('H:i'),
                        ],
                    ];
                }

                $conflictService = app(ReservationConflictService::class);
                $now = CarbonImmutable::now('Asia/Jakarta');
                $maxDate = $now->addDays(90);

                foreach ($schedulesList as $sched) {
                    $date = $sched['date'] ?? null;
                    $startStr = $sched['start_time'] ?? null;
                    $endStr = $sched['end_time'] ?? null;

                    if (! $date || ! $startStr || ! $endStr) {
                        $validator->errors()->add('start_time', 'Format jadwal tidak valid.');

                        return;
                    }

                    $startTime = CarbonImmutable::parse("{$date}T{$startStr}", 'Asia/Jakarta');
                    $endTime = CarbonImmutable::parse("{$date}T{$endStr}", 'Asia/Jakarta');

                    if ($startTime->lessThanOrEqualTo($now) || $endTime->lessThanOrEqualTo($startTime)) {
                        $validator->errors()->add('start_time', 'Waktu reservasi harus di masa depan dan waktu selesai harus setelah waktu mulai.');

                        return;
                    }

                    if ($startTime->greaterThan($maxDate)) {
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

                    if ($conflictService->hasConflict(
                        $this->user(),
                        $facility,
                        $startTime->utc(),
                        $endTime->utc(),
                    )) {
                        $validator->errors()->add('start_time', "Waktu {$date} ({$startStr}–{$endStr} WIB) bentrok dengan reservasi yang sudah disetujui.");

                        return;
                    }
                }
            },
        ];
    }
}
