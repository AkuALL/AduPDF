<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Http\Requests\UpdateReportStatusRequest;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PetugasReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = Report::query()
            ->with(['facility:id,name,location,condition', 'user:id,nama'])
            ->where('status_laporan', ReportStatus::New->value)
            ->oldest()
            ->get()
            ->map(fn (Report $report): array => $this->queueData($report))
            ->values();

        return Inertia::render('petugas/reports/index', [
            'reports' => $reports,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function show(Report $report): Response
    {
        $report->load([
            'facility:id,name,location,condition',
            'user:id,nama',
            'attachments:id,report_id,original_name,mime_type,file_size',
        ]);

        return Inertia::render('petugas/reports/show', [
            'report' => $this->reportData($report),
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

    /**
     * @return array<string, int|string|array<string, int|string>>
     */
    private function queueData(Report $report): array
    {
        return [
            'id' => $report->id,
            'kategori' => $report->kategori,
            'deskripsi' => $report->deskripsi,
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
            ])->values()->all(),
        ];
    }
}
