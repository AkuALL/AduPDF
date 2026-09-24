<?php

namespace App\Http\Requests;

use App\Enums\FacilityCondition;
use App\Enums\ReportStatus;
use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateReportFacilityConditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isPetugas() ?? false;
    }

    /**
     * @return array<string, array<int, string|Rule>>
     */
    public function rules(): array
    {
        return [
            'condition' => [
                'required',
                Rule::in([FacilityCondition::UnderRepair->value, FacilityCondition::Active->value]),
            ],
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

                /** @var Report $report */
                $report = $this->route('report');
                $facility = $report->facility;
                $nextCondition = FacilityCondition::from($this->string('condition')->toString());

                if ($facility->condition === FacilityCondition::Inactive) {
                    $validator->errors()->add('condition', 'Fasilitas nonaktif tidak dapat diubah oleh Petugas.');

                    return;
                }

                if ($facility->condition === $nextCondition) {
                    $validator->errors()->add('condition', 'Kondisi fasilitas sudah sesuai dengan tindakan yang dipilih.');

                    return;
                }

                if ($nextCondition === FacilityCondition::UnderRepair
                    && $report->status_laporan !== ReportStatus::Processing) {
                    $validator->errors()->add('condition', 'Fasilitas hanya dapat ditandai dalam perbaikan saat laporan diproses.');

                    return;
                }

                if ($nextCondition === FacilityCondition::Active) {
                    if ($report->status_laporan !== ReportStatus::Completed) {
                        $validator->errors()->add('condition', 'Fasilitas hanya dapat dikembalikan aktif setelah laporan selesai.');

                        return;
                    }

                    $hasOtherOpenReports = Report::query()
                        ->where('facility_id', $report->facility_id)
                        ->whereKeyNot($report->id)
                        ->whereIn('status_laporan', [ReportStatus::New->value, ReportStatus::Processing->value])
                        ->exists();

                    if ($hasOtherOpenReports) {
                        $validator->errors()->add('condition', 'Fasilitas masih memiliki laporan lain yang belum ditutup.');
                    }
                }
            },
        ];
    }
}
