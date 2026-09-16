<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
    $response->assertSee('Pendaftaran Pengguna');
});

test('new Pengguna can self-register with pending verification status', function () {
    $response = $this->post(route('register'), [
        'nama' => 'Ahmad Dahlan',
        'email' => 'ahmad@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertRedirect(route('login'));
    $response->assertSessionHas('status');

    $this->assertGuest();

    $this->assertDatabaseHas('users', [
        'nama' => 'Ahmad Dahlan',
        'email' => 'ahmad@kampus.ac.id',
        'role' => 'pengguna',
        'verification_status' => 'pending',
    ]);
});

test('registration fails when email is already registered', function () {
    User::factory()->create([
        'email' => 'existing@kampus.ac.id',
    ]);

    $response = $this->post(route('register'), [
        'nama' => 'Ahmad Duplikat',
        'email' => 'existing@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertSessionHasErrors(['email']);
    $this->assertGuest();
});

test('registration fails when password confirmation does not match', function () {
    $response = $this->post(route('register'), [
        'nama' => 'Ahmad Mismatch',
        'email' => 'mismatch@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'DifferentPassword!',
    ]);

    $response->assertSessionHasErrors(['password']);
    $this->assertGuest();
});
