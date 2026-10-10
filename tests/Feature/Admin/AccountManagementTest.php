<?php

use App\Enums\ReservationStatus;
use App\Models\Facility;
use App\Models\Report;
use App\Models\Reservation;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('non-admin users cannot access admin account list', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('admin.users.index'));

    $response->assertForbidden();
});

test('admin can view all other accounts in the account list', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nama' => 'Petugas Fasilitas']);
    $pengguna = User::factory()->pengguna()->create(['nama' => 'Pengguna Kampus']);
    $otherAdmin = User::factory()->admin()->create(['nama' => 'Admin Lain']);
    User::factory()->pengguna()->create(['nama' => 'Pengguna Nonaktif'])->delete();
    User::factory()->pengguna()->pendingApproval()->create(['nama' => 'Pengguna Menunggu']);

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('admin/accounts/index')
        ->has('users.data', 5)
    );
    $response->assertSee($petugas->nama);
    $response->assertSee($pengguna->nama);
    $response->assertSee($otherAdmin->nama);
    $response->assertSee('Pengguna Nonaktif');
    $response->assertSee('Pengguna Menunggu');
    $response->assertDontSee($admin->nama);
});

test('admin can create Petugas account directly (FR-15 / US-13, GAL-06)', function () {
    Notification::fake();
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.users.petugas.store'), [
        'nama' => 'Petugas Fasilitas Baru',
        'email' => 'petugas.baru@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'nama' => 'Petugas Fasilitas Baru',
        'email' => 'petugas.baru@kampus.ac.id',
        'role' => 'petugas',
        'approved_by' => $admin->id,
    ]);

    $petugas = User::query()->where('email', 'petugas.baru@kampus.ac.id')->sole();
    expect($petugas->approved_at)->not->toBeNull();
    Notification::assertNothingSent();
});

test('admin can create Pengguna account directly (FR-16 / US-14, GAL-06)', function () {
    Notification::fake();
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.users.pengguna.store'), [
        'nama' => 'Dosen Khusus',
        'email' => 'dosen.khusus@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'nama' => 'Dosen Khusus',
        'email' => 'dosen.khusus@kampus.ac.id',
        'role' => 'pengguna',
        'approved_by' => $admin->id,
    ]);

    $pengguna = User::query()->where('email', 'dosen.khusus@kampus.ac.id')->sole();
    expect($pengguna->approved_at)->not->toBeNull();
    Notification::assertNothingSent();
});

test('admin can approve a self-registered Pengguna without email verification (FR-20)', function () {
    Notification::fake();
    $admin = User::factory()->admin()->create();
    $pengguna = User::factory()->pengguna()->create([
        'approved_at' => null,
        'approved_by' => null,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.approve', $pengguna));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');
    expect($pengguna->fresh()->approved_at)->not->toBeNull()
        ->and($pengguna->fresh()->approved_by)->toBe($admin->id);
    Notification::assertNothingSent();

    $this->post(route('logout'));
    $this->post(route('login'), [
        'email' => $pengguna->email,
        'password' => 'password',
    ])->assertRedirect(url('/facilities'));
    $this->assertAuthenticatedAs($pengguna);
});

test('non-admin cannot approve a self-registered Pengguna (FR-20)', function () {
    $pengguna = User::factory()->pengguna()->create([
        'approved_at' => null,
        'approved_by' => null,
    ]);

    $this->actingAs(User::factory()->pengguna()->create())
        ->patch(route('admin.users.approve', $pengguna))
        ->assertForbidden();

    expect($pengguna->fresh()->approved_at)->toBeNull();
});

test('admin deactivation rejects pending and cancels approved unfinished reservations while preserving history (FR-16, BR-26, GAL-06)', function () {
    $admin = User::factory()->admin()->create();
    $targetUser = User::factory()->pengguna()->create([
        'nama' => 'Akun Dinonaktifkan',
        'email' => 'dinonaktifkan@kampus.ac.id',
    ]);
    $facility = Facility::factory()->create();

    $pending = Reservation::create([
        'user_id' => $targetUser->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Pengajuan menunggu',
        'start_time' => now()->addDays(1),
        'end_time' => now()->addDays(1)->addHour(),
        'status' => ReservationStatus::Pending,
    ]);
    $approvedFuture = Reservation::create([
        'user_id' => $targetUser->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Pengajuan disetujui mendatang',
        'start_time' => now()->addDays(2),
        'end_time' => now()->addDays(2)->addHour(),
        'status' => ReservationStatus::Approved,
    ]);
    $approvedOngoing = Reservation::create([
        'user_id' => $targetUser->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Pengajuan yang sedang berlangsung',
        'start_time' => now()->subHour(),
        'end_time' => now()->addHour(),
        'status' => ReservationStatus::Approved,
    ]);
    $approvedCompleted = Reservation::create([
        'user_id' => $targetUser->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Pengajuan selesai',
        'start_time' => now()->subDays(2),
        'end_time' => now()->subDay(),
        'status' => ReservationStatus::Approved,
    ]);
    $rejected = Reservation::create([
        'user_id' => $targetUser->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Pengajuan sudah ditolak',
        'start_time' => now()->addDays(3),
        'end_time' => now()->addDays(3)->addHour(),
        'status' => ReservationStatus::Rejected,
        'alasan_penolakan' => 'Alasan sebelumnya.',
    ]);
    $cancelled = Reservation::create([
        'user_id' => $targetUser->id,
        'facility_id' => $facility->id,
        'tujuan' => 'Pengajuan sudah dibatalkan',
        'start_time' => now()->addDays(4),
        'end_time' => now()->addDays(4)->addHour(),
        'status' => ReservationStatus::Cancelled,
        'alasan_pembatalan' => 'Alasan pembatalan sebelumnya.',
    ]);
    $report = Report::factory()->for($targetUser)->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.deactivate', $targetUser));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    expect($targetUser->fresh()->deleted_at)->not->toBeNull();
    $pending->refresh();
    $approvedFuture->refresh();
    $approvedOngoing->refresh();
    $approvedCompleted->refresh();
    $rejected->refresh();
    $cancelled->refresh();

    expect($pending->status)->toBe(ReservationStatus::Rejected)
        ->and($pending->alasan_penolakan)->toBe('Reservasi ditolak karena akun pemesan dinonaktifkan oleh Admin.')
        ->and($pending->ditolak_pada)->not->toBeNull()
        ->and($approvedFuture->status)->toBe(ReservationStatus::Cancelled)
        ->and($approvedFuture->alasan_pembatalan)->toBe('Reservasi dibatalkan karena akun pemesan dinonaktifkan oleh Admin.')
        ->and($approvedOngoing->status)->toBe(ReservationStatus::Cancelled)
        ->and($approvedOngoing->alasan_pembatalan)->toBe('Reservasi dibatalkan karena akun pemesan dinonaktifkan oleh Admin.')
        ->and($approvedCompleted->status)->toBe(ReservationStatus::Approved)
        ->and($rejected->status)->toBe(ReservationStatus::Rejected)
        ->and($rejected->alasan_penolakan)->toBe('Alasan sebelumnya.')
        ->and($cancelled->status)->toBe(ReservationStatus::Cancelled)
        ->and($cancelled->alasan_pembatalan)->toBe('Alasan pembatalan sebelumnya.');

    $this->assertDatabaseHas('reports', ['id' => $report->id, 'user_id' => $targetUser->id]);
    expect($report->fresh()->user->nama)->toBe('Akun Dinonaktifkan');
    expect($pending->fresh()->user->nama)->toBe('Akun Dinonaktifkan');

    $this->app['auth']->logout();
    $this->post(route('login'), [
        'email' => 'dinonaktifkan@kampus.ac.id',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->actingAs($admin)->patch(route('admin.users.activate', $targetUser))
        ->assertRedirect(route('admin.users.index'));

    expect($targetUser->fresh()?->trashed())->toBeFalse()
        ->and($pending->fresh()->status)->toBe(ReservationStatus::Rejected)
        ->and($approvedFuture->fresh()->status)->toBe(ReservationStatus::Cancelled)
        ->and($approvedOngoing->fresh()->status)->toBe(ReservationStatus::Cancelled);
});

test('admin cannot deactivate their own account (BR-26, FR-16, GAL-06)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.deactivate', $admin));

    $response->assertSessionHas('error', 'Admin tidak dapat menonaktifkan akunnya sendiri.');
    expect($admin->fresh()?->trashed())->toBeFalse();
});

test('admin seeder provisions exactly one initial admin idempotently (BR-18, GAL-01)', function () {
    $this->seed(AdminUserSeeder::class);

    $this->assertDatabaseHas('users', [
        'email' => 'admin@adupdf.ac.id',
        'role' => 'admin',
    ]);

    expect(User::where('role', 'admin')->count())->toBe(1);

    // Running again does not duplicate
    $this->seed(AdminUserSeeder::class);
    expect(User::where('role', 'admin')->count())->toBe(1);
});

test('admin can deactivate and reactivate a Petugas account (SRS 12.5, BR-26, GAL-06)', function () {
    $admin = User::factory()->admin()->create();
    $targetPetugas = User::factory()->petugas()->create([
        'nama' => 'Petugas Dinonaktifkan',
        'email' => 'petugas.nonaktif@kampus.ac.id',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.deactivate', $targetPetugas));

    $response->assertRedirect(route('admin.users.index'));
    expect($targetPetugas->fresh()?->trashed())->toBeTrue();

    $response = $this->actingAs($admin)->patch(route('admin.users.activate', $targetPetugas));

    $response->assertRedirect(route('admin.users.index'));
    expect($targetPetugas->fresh()?->trashed())->toBeFalse();

    $this->app['auth']->logout();
    $this->post(route('login'), [
        'email' => 'petugas.nonaktif@kampus.ac.id',
        'password' => 'password',
    ])->assertRedirect(route('petugas.dashboard'));
    $this->assertAuthenticatedAs($targetPetugas);
});

test('admin cannot create another admin account (BR-18, GAL-06)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/users/admin', [
        'nama' => 'Admin Baru',
        'email' => 'admin.baru@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    // Route does not exist for creating admin accounts (returns 404 or 405 Method Not Allowed)
    $this->assertTrue(in_array($response->status(), [404, 405]));
    $this->assertDatabaseMissing('users', [
        'email' => 'admin.baru@kampus.ac.id',
    ]);
});

test('nonaktif user is blocked and logged out from role-protected routes (BR-26, SRS 7.1)', function () {
    $user = User::factory()->pengguna()->create();

    // Authenticate, then deactivate the account.
    $user->delete();

    $response = $this->actingAs($user)->get(route('profile.edit'));
    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});
