<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('non-admin users cannot access admin change password page', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->get(route('admin.password.edit'));
    $response->assertForbidden();
});

use Inertia\Testing\AssertableInertia as Assert;

test('admin can view change password form', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.password.edit'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/accounts/change-password'));
});

test('admin can update password with valid current password', function () {
    $admin = User::factory()->admin()->create([
        'password' => Hash::make('OldPassword123!'),
    ]);

    $response = $this->actingAs($admin)->put(route('admin.password.update'), [
        'current_password' => 'OldPassword123!',
        'password' => 'NewSecurePassword123!',
        'password_confirmation' => 'NewSecurePassword123!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertTrue(Hash::check('NewSecurePassword123!', $admin->fresh()->password));
});

test('admin cannot update password with invalid current password', function () {
    $admin = User::factory()->admin()->create([
        'password' => Hash::make('OldPassword123!'),
    ]);

    $response = $this->actingAs($admin)->put(route('admin.password.update'), [
        'current_password' => 'WrongCurrentPassword!',
        'password' => 'NewSecurePassword123!',
        'password_confirmation' => 'NewSecurePassword123!',
    ]);

    $response->assertSessionHasErrors('current_password');
    $this->assertTrue(Hash::check('OldPassword123!', $admin->fresh()->password));
});
