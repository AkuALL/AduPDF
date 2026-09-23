<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated with institutional identity and whatsapp (FR-17, GAL-05)', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Budi Utomo',
            'email' => 'budi.utomo@kampus.ac.id',
            'identity_type' => 'nim',
            'institutional_id' => '24060121140099',
            'whatsapp' => '081234567890',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Budi Utomo')
        ->and($user->email)->toBe('budi.utomo@kampus.ac.id')
        ->and($user->identity_type)->toBe('nim')
        ->and($user->institutional_id)->toBe('24060121140099')
        ->and($user->whatsapp)->toBe('081234567890')
        ->and($user->hasInstitutionalIdentity())->toBeTrue();
});

test('profile update validates identity_type and institutional_id consistency', function () {
    $user = User::factory()->create();

    // institutional_id without identity_type
    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Budi Utomo',
            'email' => $user->email,
            'institutional_id' => '24060121140099',
        ]);

    $response->assertSessionHasErrors(['identity_type']);

    // identity_type without institutional_id
    $response2 = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Budi Utomo',
            'email' => $user->email,
            'identity_type' => 'nim',
        ]);

    $response2->assertSessionHasErrors(['institutional_id']);
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    $this->assertSoftDeleted('users', [
        'id' => $user->id,
    ]);
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});

test('system prevents deletion of the last admin account via profile settings (BR-26, FR-16, SRS 7.1)', function () {
    $admin = User::factory()->admin()->create();

    $response = $this
        ->actingAs($admin)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response->assertSessionHas('error', 'Admin terakhir tidak dapat dihapus.');
    $this->assertNotSoftDeleted('users', [
        'id' => $admin->id,
    ]);
});
