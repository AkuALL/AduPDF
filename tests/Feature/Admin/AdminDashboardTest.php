<?php

use App\Enums\FacilityCondition;
use App\Enums\FacilityType;
use App\Enums\ReportStatus;
use App\Enums\ReservationStatus;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Facility;
use App\Models\Report;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to login when visiting admin dashboard (DA-01, RBAC)', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});

test('pengguna cannot access admin dashboard (DA-01, RBAC)', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

test('petugas cannot access admin dashboard (DA-01, RBAC)', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

test('admin can visit executive dashboard with empty state (DA-01, DA-03)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->where('facility_stats.total', 0)
        ->where('maintenance_stats.under_repair_count', 0)
    );
});

test('dashboard route redirects admin to admin dashboard (DA-01, DA-03)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('dashboard'));

    $response->assertRedirect(route('admin.dashboard'));
});

test('admin dashboard presents facility infrastructure, occupancy highlights, and maintenance watchlist (DA-03, FR-19)', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->pengguna()->create();

    $roomActive = Facility::factory()->create([
        'name' => 'Aula Utama Sukarno',
        'type' => FacilityType::Hall,
        'location' => 'Gedung Pusat Lt. 1',
        'condition' => FacilityCondition::Active,
    ]);

    $roomRepair = Facility::factory()->create([
        'name' => 'Lab Komputer 03',
        'type' => FacilityType::Laboratory,
        'location' => 'Gedung Teknik Lt. 2',
        'condition' => FacilityCondition::UnderRepair,
    ]);

    // Approved reservation this month for Aula Utama
    Reservation::create([
        'user_id' => $user->id,
        'facility_id' => $roomActive->id,
        'tujuan' => 'Kuliah Perdana Semester Ganjil',
        'start_time' => now()->startOfMonth()->addDays(2)->setTime(9, 0, 0),
        'end_time' => now()->startOfMonth()->addDays(2)->setTime(12, 0, 0),
        'status' => ReservationStatus::Approved,
    ]);

    // Damage report for Lab Komputer
    Report::factory()->create([
        'user_id' => $user->id,
        'facility_id' => $roomRepair->id,
        'kategori' => 'Kelistrikan',
        'deskripsi' => 'Korsleting saklar utama',
        'status_laporan' => ReportStatus::New,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->where('facility_stats.total', 2)
        ->where('facility_stats.active', 1)
        ->where('facility_stats.under_repair', 1)
        ->where('usage_stats.total_reservations', 1)
        ->where('usage_stats.total_hours', 3)
        ->has('usage_stats.top_used_facilities', 1, fn (Assert $item) => $item
            ->where('name', 'Aula Utama Sukarno')
            ->where('usage_count', 1)
            ->etc()
        )
        ->has('maintenance_stats.under_repair_list', 1, fn (Assert $item) => $item
            ->where('name', 'Lab Komputer 03')
            ->where('location', 'Gedung Teknik Lt. 2')
            ->etc()
        )
    );
});

test('admin dashboard inertia response returns complete executive props (DA-01, DA-03)', function () {
    $admin = User::factory()->admin()->create();

    $version = app(HandleInertiaRequests::class)->version(request());

    $response = $this->actingAs($admin)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
        ])
        ->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertJsonPath('component', 'admin/dashboard');
    $response->assertJsonPath('props.account_stats.admin_count', 1);
});
