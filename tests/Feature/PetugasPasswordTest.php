<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('non-petugas users cannot access petugas change password page', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('petugas.password.edit'));
    $response->assertForbidden();
});

test('petugas can view change password form', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this->actingAs($petugas)->get(route('petugas.password.edit'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('petugas/change-password'));
});

test('petugas can update password with valid current password', function () {
    $petugas = User::factory()->petugas()->create([
        'password' => Hash::make('OldPassword123!'),
    ]);

    $response = $this->actingAs($petugas)->put(route('petugas.password.update'), [
        'current_password' => 'OldPassword123!',
        'password' => 'NewSecurePassword123!',
        'password_confirmation' => 'NewSecurePassword123!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertTrue(Hash::check('NewSecurePassword123!', $petugas->fresh()->password));
});

test('petugas cannot update password with invalid current password', function () {
    $petugas = User::factory()->petugas()->create([
        'password' => Hash::make('OldPassword123!'),
    ]);

    $response = $this->actingAs($petugas)->put(route('petugas.password.update'), [
        'current_password' => 'WrongCurrentPassword!',
        'password' => 'NewSecurePassword123!',
        'password_confirmation' => 'NewSecurePassword123!',
    ]);

    $response->assertSessionHasErrors('current_password');
    $this->assertTrue(Hash::check('OldPassword123!', $petugas->fresh()->password));
});
