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
}
