<?php

namespace App\Http\Requests;

use App\Enums\ReportStatus;
use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateReportStatusRequest extends FormRequest
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
            'status_laporan' => [
                'required',
                Rule::in([ReportStatus::Processing->value, ReportStatus::Completed->value, ReportStatus::Rejected->value]),
            ],
            'catatan_resolusi' => ['nullable', 'string', 'max:65535'],
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
                $nextStatus = ReportStatus::from($this->string('status_laporan')->toString());

                if (! $this->canTransition($report->status_laporan, $nextStatus)) {
                    $validator->errors()->add('status_laporan', 'Status laporan tidak dapat diubah dari status saat ini.');

                    return;
                }

                if (in_array($nextStatus, [ReportStatus::Completed, ReportStatus::Rejected], true)
                    && $this->string('catatan_resolusi')->trim()->isEmpty()) {
                    $validator->errors()->add('catatan_resolusi', 'Catatan resolusi wajib diisi ketika laporan ditutup.');
                }
            },
        ];
    }

    private function canTransition(ReportStatus $currentStatus, ReportStatus $nextStatus): bool
    {
        return match ($currentStatus) {
            ReportStatus::New => in_array($nextStatus, [ReportStatus::Processing, ReportStatus::Rejected], true),
            ReportStatus::Processing => in_array($nextStatus, [ReportStatus::Completed, ReportStatus::Rejected], true),
            ReportStatus::Completed, ReportStatus::Rejected => false,
        };
    }
}
