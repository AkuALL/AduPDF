<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFacilityRequest;
use App\Http\Requests\Admin\UpdateFacilityRequest;
use App\Models\Facility;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class FacilityManagementController extends Controller
{
    /**
     * Display a listing of facilities for administrator (AG-05, FR-18).
     */
    public function index(Request $request): View
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

        return view('admin.facilities.index', compact('facilities', 'counts', 'search', 'type', 'condition'));
    }

    /**
     * Show form to create a new facility (AG-05, FR-18).
     */
    public function create(): View
    {
        $parentRooms = Facility::query()
            ->whereIn('type', [FacilityType::Classroom, FacilityType::Hall, FacilityType::Laboratory])
            ->orderBy('name')
            ->get();

        return view('admin.facilities.create', compact('parentRooms'));
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
    public function show(Facility $facility): View
    {
        $facility->load([
            'parentFacility:id,name,type,condition,location',
            'childTools:id,name,type,condition,parent_facility_id',
        ])->loadCount(['childTools', 'reservations']);

        return view('admin.facilities.show', compact('facility'));
    }

    /**
     * Show form to edit facility (AG-05, FR-18).
     */
    public function edit(Facility $facility): View
    {
        $parentRooms = Facility::query()
            ->whereIn('type', [FacilityType::Classroom, FacilityType::Hall, FacilityType::Laboratory])
            ->where('id', '!=', $facility->id)
            ->orderBy('name')
            ->get();

        return view('admin.facilities.edit', compact('facility', 'parentRooms'));
    }

    /**
     * Update facility details (AG-05, FR-18).
     */
    public function update(UpdateFacilityRequest $request, Facility $facility): RedirectResponse
    {
        $validated = $request->validated();

        if ($validated['type'] !== FacilityType::Equipment->value) {
            $validated['parent_facility_id'] = null;
        }

        $facility->update($validated);

        return redirect()->route('admin.facilities.show', $facility)
            ->with('success', "Data fasilitas {$facility->name} berhasil diperbarui.");
    }

    /**
     * Deactivate facility (AG-05, FR-18).
     */
    public function deactivate(Facility $facility): RedirectResponse
    {
        $facility->update(['condition' => FacilityCondition::Inactive]);

        return back()->with('success', "Fasilitas {$facility->name} telah berhasil dinonaktifkan.");
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
