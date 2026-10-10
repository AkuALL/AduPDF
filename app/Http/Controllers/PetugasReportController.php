<?php

namespace App\Http\Controllers;

use App\Enums\FacilityCondition;
use App\Enums\ReportStatus;
use App\Http\Requests\UpdateReportFacilityConditionRequest;
use App\Http\Requests\UpdateReportStatusRequest;
use App\Models\Report;
use App\Services\FacilityConditionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PetugasReportController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', ReportStatus::New->value);

        $query = Report::query()
            ->with(['facility:id,name,location,condition', 'user:id,nama']);

        if ($status !== 'all' && in_array($status, [ReportStatus::New->value, ReportStatus::Processing->value, ReportStatus::Completed->value, ReportStatus::Rejected->value])) {
            $query->where('status_laporan', $status);
        }

        $reports = $query->oldest('id')
            ->get()
            ->map(fn (Report $report): array => $this->queueData($report))
            ->values();

        $counts = [
            'all' => Report::count(),
            'baru' => Report::where('status_laporan', ReportStatus::New->value)->count(),
            'diproses' => Report::where('status_laporan', ReportStatus::Processing->value)->count(),
            'selesai' => Report::where('status_laporan', ReportStatus::Completed->value)->count(),
            'ditolak' => Report::where('status_laporan', ReportStatus::Rejected->value)->count(),
        ];

        return Inertia::render('petugas/reports/index', [
            'reports' => $reports,
            'counts' => $counts,
            'current_status' => $status,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function show(Request $request, Report $report): Response
    {
        $report->load([
            'facility:id,name,location,condition',
            'user:id,nama',
            'attachments:id,report_id,original_name,mime_type,file_size',
        ]);

        return Inertia::render('petugas/reports/show', [
            'report' => $this->reportData($report),
            'success' => $request->session()->get('success'),
        ]);
    }

    public function update(UpdateReportStatusRequest $request, Report $report): RedirectResponse
    {
        $input = $request->validated();
        $updated = Report::query()
            ->whereKey($report->id)
            ->where('status_laporan', $report->status_laporan->value)
            ->update([
                'status_laporan' => $input['status_laporan'],
                'catatan_resolusi' => $input['catatan_resolusi'] ?? null,
            ]);

        if ($updated === 0) {
            throw ValidationException::withMessages([
                'status_laporan' => 'Status laporan telah berubah. Muat ulang halaman lalu coba lagi.',
            ]);
        }

        return redirect()->route('petugas.reports.show', $report)
            ->with('success', 'Status laporan berhasil diperbarui.');
    }

    public function updateFacilityCondition(
        UpdateReportFacilityConditionRequest $request,
        Report $report,
        FacilityConditionService $conditions,
    ): RedirectResponse {
        $condition = FacilityCondition::from($request->string('condition')->toString());
        $conditions->updateCondition($report->facility, $condition);

        return redirect()->route('petugas.reports.show', $report)
            ->with('success', 'Kondisi fasilitas berhasil diperbarui.');
    }

    /**
     * @return array<string, int|string|array<string, int|string>>
     */
    private function queueData(Report $report): array
    {
        return [
            'id' => $report->id,
            'kategori' => $report->kategori,
            'deskripsi' => $report->deskripsi,
            'status_laporan' => $report->status_laporan->value,
            'reported_at' => $report->created_at->setTimezone('Asia/Jakarta')->format('d M Y, H:i'),
            'reporter' => $report->user->name,
            'facility' => [
                'name' => $report->facility->name,
                'location' => $report->facility->location,
                'condition' => $report->facility->condition->value,
            ],
        ];
    }

    /**
     * @return array<string, int|string|null|array<string, int|string>|array<int, array<string, int|string>>>
     */
    private function reportData(Report $report): array
    {
        return [
            ...$this->queueData($report),
            'status_laporan' => $report->status_laporan->value,
            'catatan_resolusi' => $report->catatan_resolusi,
            'attachments' => $report->attachments->map(fn ($attachment): array => [
                'id' => $attachment->id,
                'original_name' => $attachment->original_name,
                'mime_type' => $attachment->mime_type,
                'file_size' => $attachment->file_size,
                'url' => route('reports.attachments.show', $attachment),
            ])->values()->all(),
        ];
    }
}
