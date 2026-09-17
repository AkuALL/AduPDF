<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFacilityRequest;
use App\Http\Requests\Admin\UpdateFacilityRequest;
use App\Models\Facility;
use App\Services\ReservationImpactService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacilityManagementController extends Controller
{
    /**
     * Display a listing of facilities for administrator (AG-05, FR-18).
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $type = $request->query('type');
        $condition = $request->query('condition');

        $query = Facility::query()
            ->with(['parentFacility:id,name', 'childTools:id,name,type,condition,parent_facility_id'])
            ->withCount(['childTools', 'reservations']);

        if (! empty($search)) {
            $query->where(function (Builder $query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if (! empty($type) && FacilityType::tryFrom($type) !== null) {
            $query->where('type', $type);
        }

        if (! empty($condition) && FacilityCondition::tryFrom($condition) !== null) {
            $query->where('condition', $condition);
        }

        $facilities = $query->orderBy('name')->paginate(15)->withQueryString();

        $counts = [
            'total' => Facility::count(),
            'active' => Facility::where('condition', FacilityCondition::Active)->count(),
            'under_repair' => Facility::where('condition', FacilityCondition::UnderRepair)->count(),
            'inactive' => Facility::where('condition', FacilityCondition::Inactive)->count(),
        ];

        return Inertia::render('admin/facilities/index', compact('facilities', 'counts', 'search', 'type', 'condition'));
    }

    /**
     * Show form to create a new facility (AG-05, FR-18).
     */
    public function create(): Response
    {
        $parentRooms = Facility::query()
            ->whereIn('type', [FacilityType::Classroom, FacilityType::Hall, FacilityType::Laboratory])
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/facilities/create', compact('parentRooms'));
    }

    /**
     * Store a newly created facility (AG-05, FR-18).
     */
    public function store(StoreFacilityRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($validated['type'] !== FacilityType::Equipment->value) {
            $validated['parent_facility_id'] = null;
        }

        $facility = Facility::create($validated);

        return redirect()->route('admin.facilities.show', $facility)
            ->with('success', "Fasilitas {$facility->name} berhasil ditambahkan ke sistem.");
    }

    /**
     * Display detailed admin view of a facility (AG-05, FR-18).
     */
    public function show(Facility $facility): Response
    {
        $facility->load([
            'parentFacility:id,name,type,condition,location',
            'childTools:id,name,type,condition,parent_facility_id',
        ])->loadCount(['childTools', 'reservations']);

        return Inertia::render('admin/facilities/show', compact('facility'));
    }

    /**
     * Show form to edit facility (AG-05, FR-18).
     */
    public function edit(Facility $facility): Response
    {
        $parentRooms = Facility::query()
            ->whereIn('type', [FacilityType::Classroom, FacilityType::Hall, FacilityType::Laboratory])
            ->where('id', '!=', $facility->id)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/facilities/edit', compact('facility', 'parentRooms'));
    }

    /**
     * Update facility details (AG-05, AG-06, FR-18).
     */
    public function update(UpdateFacilityRequest $request, Facility $facility, ReservationImpactService $impactService): RedirectResponse
    {
        $validated = $request->validated();

        if ($validated['type'] !== FacilityType::Equipment->value) {
            $validated['parent_facility_id'] = null;
        }

        $wasInactive = $facility->condition === FacilityCondition::Inactive;
        $isNowInactive = $validated['condition'] === FacilityCondition::Inactive->value;

        $facility->update($validated);

        if (! $wasInactive && $isNowInactive) {
            $impact = $impactService->applyDeactivation($facility);
            $message = "Data fasilitas {$facility->name} berhasil diperbarui dan dinonaktifkan.";
            if ($impact['rejected'] > 0 || $impact['cancelled'] > 0) {
                $message .= " Dampak reservasi: {$impact['rejected']} reservasi menunggu otomatis ditolak, dan {$impact['cancelled']} reservasi disetujui otomatis dibatalkan.";
            }

            return redirect()->route('admin.facilities.show', $facility)->with('success', $message);
        }

        return redirect()->route('admin.facilities.show', $facility)
            ->with('success', "Data fasilitas {$facility->name} berhasil diperbarui.");
    }

    /**
     * Deactivate facility with absolute reservation cancellation/rejection (AG-05, AG-06, FR-18).
     */
    public function deactivate(Facility $facility, ReservationImpactService $impactService): RedirectResponse
    {
        $facility->update(['condition' => FacilityCondition::Inactive]);

        $impact = $impactService->applyDeactivation($facility);

        $message = "Fasilitas {$facility->name} telah berhasil dinonaktifkan.";
        if ($impact['rejected'] > 0 || $impact['cancelled'] > 0) {
            $message .= " Dampak penonaktifan: {$impact['rejected']} reservasi menunggu otomatis ditolak dan {$impact['cancelled']} reservasi disetujui otomatis dibatalkan.";
        }

        return back()->with('success', $message);
    }

    /**
     * Activate facility (AG-05, FR-18).
     */
    public function activate(Facility $facility): RedirectResponse
    {
        $facility->update(['condition' => FacilityCondition::Active]);

        return back()->with('success', "Fasilitas {$facility->name} telah berhasil diaktifkan kembali.");
    }

    /**
     * Delete facility with history guard (AG-05, FR-18).
     */
    public function destroy(Facility $facility): RedirectResponse
    {
        if ($facility->hasHistory()) {
            return back()->with('error', 'Fasilitas tidak dapat dihapus permanen karena memiliki riwayat reservasi (FR-18). Silakan gunakan tombol Nonaktifkan.');
        }

        if ($facility->childTools()->exists()) {
            return back()->with('error', 'Fasilitas tidak dapat dihapus karena masih memiliki peralatan yang terikat di ruangan ini. Hapus atau pindahkan peralatan terlebih dahulu.');
        }

        $name = $facility->name;
        $facility->delete();

        return redirect()->route('admin.facilities.index')
            ->with('success', "Fasilitas {$name} berhasil dihapus permanen dari sistem.");
    }
}
