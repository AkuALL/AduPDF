<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('non-admin users cannot access admin verification queue', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('admin.verifications.index'));
    $response->assertForbidden();
});

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

test('admin can view verification queue with pending users', function () {
    $admin = User::factory()->admin()->create();
    $pendingUser = User::factory()->pending()->create([
        'nama' => 'Calon Pengguna',
        'email' => 'calon@kampus.ac.id',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.verifications.index'));

    $response->assertOk();
    $response->assertSee('Calon Pengguna');
    $response->assertSee('calon@kampus.ac.id');
    $response->assertSee('Menunggu Verifikasi');
});

test('admin can approve a pending Pengguna account', function () {
    $admin = User::factory()->admin()->create();
    $pendingUser = User::factory()->pending()->create([
        'nama' => 'Mahasiswa Baru',
        'verification_status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.verify', $pendingUser));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertEquals('approved', $pendingUser->fresh()->verification_status);
});

test('admin can reject a pending Pengguna account', function () {
    $admin = User::factory()->admin()->create();
    $pendingUser = User::factory()->pending()->create([
        'nama' => 'Pendaftar Palsu',
        'verification_status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.reject', $pendingUser));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertEquals('rejected', $pendingUser->fresh()->verification_status);
});

test('state transition guard: admin cannot verify an already approved or rejected user', function () {
    $admin = User::factory()->admin()->create();
    $alreadyApproved = User::factory()->pengguna()->create([
        'verification_status' => 'approved',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.verify', $alreadyApproved));

    $response->assertSessionHas('error');
    $this->assertEquals('approved', $alreadyApproved->fresh()->verification_status);
});

test('state transition guard: admin cannot reject an already approved or rejected user', function () {
    $admin = User::factory()->admin()->create();
    $alreadyRejected = User::factory()->rejected()->create([
        'verification_status' => 'rejected',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.reject', $alreadyRejected));

    $response->assertSessionHas('error');
    $this->assertEquals('rejected', $alreadyRejected->fresh()->verification_status);
});

test('admin can create Petugas account directly (FR-15 / US-13)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.users.petugas.store'), [
        'nama' => 'Petugas Fasilitas Baru',
        'email' => 'petugas.baru@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertRedirect(route('admin.verifications.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'nama' => 'Petugas Fasilitas Baru',
        'email' => 'petugas.baru@kampus.ac.id',
        'role' => 'petugas',
        'verification_status' => 'approved',
    ]);
});

test('admin can create Pengguna account directly (FR-16 / US-14)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.users.pengguna.store'), [
        'nama' => 'Dosen Khusus',
        'email' => 'dosen.khusus@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertRedirect(route('admin.verifications.index', ['status' => 'approved']));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'nama' => 'Dosen Khusus',
        'email' => 'dosen.khusus@kampus.ac.id',
        'role' => 'pengguna',
        'verification_status' => 'approved',
    ]);
});
