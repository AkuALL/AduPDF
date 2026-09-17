<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
    $response->assertSee('Masuk ke AduPDF');
});

test('approved Pengguna can authenticate successfully', function () {
    $user = User::factory()->pengguna()->create([
        'email' => 'pengguna@kampus.ac.id',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'pengguna@kampus.ac.id',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(url('/facilities'));
});

test('pending Pengguna CANNOT authenticate and receives pending error notice', function () {
    $user = User::factory()->pending()->create([
        'email' => 'pending@kampus.ac.id',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'pending@kampus.ac.id',
        'password' => 'password123',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
    $this->assertTrue(str_contains(
        session('errors')->first('email'),
        'menunggu verifikasi'
    ));
});

test('rejected Pengguna CANNOT authenticate and receives rejected error notice', function () {
    $user = User::factory()->rejected()->create([
        'email' => 'rejected@kampus.ac.id',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'rejected@kampus.ac.id',
        'password' => 'password123',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
    $this->assertTrue(str_contains(
        session('errors')->first('email'),
        'ditolak'
    ));
});

test('petugas can authenticate successfully', function () {
    $petugas = User::factory()->petugas()->create([
        'email' => 'petugas@kampus.ac.id',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'petugas@kampus.ac.id',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($petugas);
    $response->assertRedirect(url('/petugas/dashboard'));
});

test('admin can authenticate successfully and redirects to verifications', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@kampus.ac.id',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'admin@kampus.ac.id',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($admin);
    $response->assertRedirect(route('admin.verifications.index'));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create([
        'password' => bcrypt('correct-password'),
    ]);

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('login'));
    $this->assertGuest();
});
