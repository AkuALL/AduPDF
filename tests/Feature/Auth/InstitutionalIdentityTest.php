<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

test('pengguna without institutional identity is redirected to profile when accessing protected route (GAL-05, SRS 7.1)', function () {
    Route::get('/test-reservation-gate', function () {
        return 'Access granted';
    })->middleware(['web', 'auth', 'role:pengguna', 'institutional.identity']);

    $pengguna = User::factory()->pengguna()->create([
        'institutional_id' => null,
        'identity_type' => null,
    ]);

    $response = $this->actingAs($pengguna)->get('/test-reservation-gate');

    $response->assertRedirect(route('profile.edit'));
    $response->assertSessionHas('warning');
});

test('pengguna with complete institutional identity can pass institutional identity guard (GAL-05)', function () {
    Route::get('/test-reservation-gate', function () {
        return 'Access granted';
    })->middleware(['web', 'auth', 'role:pengguna', 'institutional.identity']);

    $pengguna = User::factory()->pengguna()->withInstitutionalIdentity('nim', '24060121140001')->create();

    $response = $this->actingAs($pengguna)->get('/test-reservation-gate');

    $response->assertOk();
    $response->assertSee('Access granted');
});

test('profile can be updated directly via PATCH /profile (FR-17, SRS 12.5)', function () {
    $pengguna = User::factory()->pengguna()->create();

    $response = $this->actingAs($pengguna)->patch('/profile', [
        'nama' => 'Galang Pratama',
        'email' => $pengguna->email,
        'identity_type' => 'nim',
        'institutional_id' => '24060121140088',
        'whatsapp' => '081299887766',
    ]);

    $response->assertRedirect(route('profile.edit'));
    $response->assertSessionHas('status', 'profile-updated');

    $pengguna->refresh();
    expect($pengguna->nama)->toBe('Galang Pratama')
        ->and($pengguna->hasInstitutionalIdentity())->toBeTrue()
        ->and($pengguna->institutional_id)->toBe('24060121140088')
        ->and($pengguna->whatsapp)->toBe('081299887766');
});
