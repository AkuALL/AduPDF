<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('user name is stored once and the framework name alias stays available', function () {
    expect(Schema::hasColumn('users', 'nama'))->toBeTrue()
        ->and(Schema::hasColumn('users', 'name'))->toBeFalse();

    $user = User::factory()->create(['nama' => 'Dewi Sartika']);

    expect($user->name)->toBe('Dewi Sartika')
        ->and($user->fresh()->toArray()['name'])->toBe('Dewi Sartika');
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('auth/register'));
});

test('unverified account can open the email verification prompt', function () {
    $user = User::factory()->pengguna()->unverified()->create();

    $response = $this->actingAs($user)->get(route('verification.notice'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('auth/verify-email'));
});

test('new Pengguna must wait for Admin approval before login (GAL-02, BR-05, BR-06, FR-20)', function () {
    $response = $this->post(route('register'), [
        'nama' => 'Ahmad Dahlan',
        'email' => 'ahmad@kampus.ac.id',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'approved_at' => now()->toDateTimeString(),
        'approved_by' => 1,
    ]);

    $response->assertRedirect(route('login'));
    $response->assertSessionHas('status', 'Pendaftaran berhasil. Akun Anda menunggu persetujuan Admin sebelum dapat digunakan.');

    $this->assertGuest();

    $this->assertDatabaseHas('users', [
        'nama' => 'Ahmad Dahlan',
        'email' => 'ahmad@kampus.ac.id',
        'role' => 'pengguna',
        'approved_at' => null,
        'approved_by' => null,
        'email_verified_at' => null,
    ]);

    $loginResponse = $this->post(route('login'), [
        'email' => 'ahmad@kampus.ac.id',
        'password' => 'Password123!',
    ]);

    $loginResponse->assertSessionHasErrors([
        'email' => 'Akun Anda masih menunggu persetujuan Admin.',
    ]);
    $this->assertGuest();
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
