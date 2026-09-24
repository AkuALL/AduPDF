<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('non-admin users cannot access admin account list', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('admin.users.index'));

    $response->assertForbidden();
});

test('admin can view Petugas and Pengguna account list', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nama' => 'Petugas Fasilitas']);
    $pengguna = User::factory()->pengguna()->create(['nama' => 'Pengguna Kampus']);
    $otherAdmin = User::factory()->admin()->create(['nama' => 'Admin Lain']);

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertOk();
    $response->assertSee($petugas->nama);
    $response->assertSee($pengguna->nama);
    $response->assertDontSee($otherAdmin->nama);
});

test('admin can create Petugas account directly (FR-15 / US-13, GAL-06)', function () {
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
    ]);
});

test('admin can create Pengguna account directly (FR-16 / US-14, GAL-06)', function () {
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
    ]);
});

test('admin can soft-delete an account of any role (FR-16, BR-26, GAL-06)', function () {
    $admin = User::factory()->admin()->create();
    $targetUser = User::factory()->pengguna()->create([
        'nama' => 'Akun Dinonaktifkan',
        'email' => 'dinonaktifkan@kampus.ac.id',
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $targetUser));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    // Soft delete verifies record still in database with deleted_at set
    $this->assertSoftDeleted('users', [
        'id' => $targetUser->id,
        'email' => 'dinonaktifkan@kampus.ac.id',
    ]);

    // Soft-deleted user cannot login (BR-26, SRS 7.1)
    $this->app['auth']->logout();
    $this->post(route('login'), [
        'email' => 'dinonaktifkan@kampus.ac.id',
        'password' => 'password',
    ])->assertSessionHasErrors('email');
});

test('system prevents deletion of the last admin account (BR-26, FR-16, GAL-06)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin));

    $response->assertSessionHas('error', 'Admin terakhir tidak dapat dihapus.');
    $this->assertNotSoftDeleted('users', [
        'id' => $admin->id,
    ]);
});

test('admin seeder provisions exactly one initial admin idempotently (BR-18, GAL-01)', function () {
    $this->seed(\Database\Seeders\AdminUserSeeder::class);

    $this->assertDatabaseHas('users', [
        'email' => 'admin@adupdf.ac.id',
        'role' => 'admin',
    ]);

    expect(User::where('role', 'admin')->count())->toBe(1);

    // Running again does not duplicate
    $this->seed(\Database\Seeders\AdminUserSeeder::class);
    expect(User::where('role', 'admin')->count())->toBe(1);
});

test('admin can soft-delete an account via patch /admin/users/{user}/deactivate (SRS 12.5, BR-26, GAL-06)', function () {
    $admin = User::factory()->admin()->create();
    $targetPetugas = User::factory()->petugas()->create([
        'nama' => 'Petugas Dinonaktifkan',
        'email' => 'petugas.nonaktif@kampus.ac.id',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.deactivate', $targetPetugas));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $this->assertSoftDeleted('users', [
        'id' => $targetPetugas->id,
        'email' => 'petugas.nonaktif@kampus.ac.id',
    ]);
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

test('soft-deleted user is blocked and logged out from role-protected routes (BR-26, SRS 7.1)', function () {
    $user = User::factory()->pengguna()->create();

    // Authenticate and soft-delete
    $user->delete();

    $response = $this->actingAs($user)->get(route('profile.edit'));
    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});
