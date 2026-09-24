<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('auth/login'));
});

test('pengguna can authenticate successfully', function () {
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

test('soft-deleted account CANNOT authenticate (BR-26, SRS 7.1)', function () {
    $user = User::factory()->pengguna()->create([
        'email' => 'deleted@kampus.ac.id',
        'password' => bcrypt('password123'),
    ]);
    $user->delete();

    $response = $this->post(route('login'), [
        'email' => 'deleted@kampus.ac.id',
        'password' => 'password123',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
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

test('admin can authenticate successfully and redirects to user list', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@kampus.ac.id',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'admin@kampus.ac.id',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($admin);
    $response->assertRedirect(route('admin.users.index'));
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
