<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Http\Requests\StoreReportRequest;
use App\Models\Facility;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = Report::query()
            ->with('facility:id,name,location')
            ->whereBelongsTo($request->user())
            ->latest()
            ->get()
            ->map(fn (Report $report): array => $this->reportListData($report))
            ->values();

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function create(Request $request): Response
    {
        $facilities = Facility::query()
            ->orderBy('name')
            ->get(['id', 'name', 'location'])
            ->map(fn (Facility $facility): array => [
                'id' => $facility->id,
                'name' => $facility->name,
                'location' => $facility->location,
            ])
            ->values();

        return Inertia::render('reports/create', [
            'facilities' => $facilities,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $input = $request->validated();

        $report = Report::create([
            'user_id' => $request->user()->id,
            'facility_id' => $input['facility_id'],
            'kategori' => $input['kategori'],
            'deskripsi' => $input['deskripsi'],
            'status_laporan' => ReportStatus::New,
        ]);

        foreach ($request->file('attachments') as $attachment) {
            $path = $attachment->store('reports');

            $report->attachments()->create([
                'file_path' => $path,
                'original_name' => $attachment->getClientOriginalName(),
                'mime_type' => $attachment->getMimeType(),
                'file_size' => $attachment->getSize(),
            ]);
        }

        return redirect()->route('reports.create')
            ->with('success', 'Laporan kerusakan berhasil dikirim.');
    }

    public function show(Request $request, Report $report): Response
    {
        $this->ensureOwner($request, $report);
        $report->load(['facility:id,name,location', 'attachments:id,report_id,original_name,mime_type,file_size']);

        return Inertia::render('reports/show', [
            'report' => $this->reportDetailData($report),
        ]);
    }

    private function ensureOwner(Request $request, Report $report): void
    {
        abort_unless((int) $report->user_id === (int) $request->user()->id, 403);
    }

    /**
     * @return array<string, int|string|array<string, int|string>>
     */
    private function reportListData(Report $report): array
    {
        return [
            'id' => $report->id,
            'kategori' => $report->kategori,
            'deskripsi' => $report->deskripsi,
            'status_laporan' => $report->status_laporan->value,
            'reported_at' => $report->created_at->setTimezone('Asia/Jakarta')->format('d M Y, H:i'),
            'facility' => [
                'id' => $report->facility->id,
                'name' => $report->facility->name,
                'location' => $report->facility->location,
            ],
        ];
    }

    /**
     * @return array<string, int|string|null|array<string, int|string>|array<int, array<string, int|string>>>
     */
    private function reportDetailData(Report $report): array
    {
        return [
            ...$this->reportListData($report),
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
