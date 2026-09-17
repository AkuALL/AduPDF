<?php

use App\Models\User;

test('role helper methods identify roles accurately', function () {
    $pengguna = new User(['role' => 'pengguna']);
    expect($pengguna->isPengguna())->toBeTrue()
        ->and($pengguna->isPetugas())->toBeFalse()
        ->and($pengguna->isAdmin())->toBeFalse();

    $petugas = new User(['role' => 'petugas']);
    expect($petugas->isPetugas())->toBeTrue()
        ->and($petugas->isPengguna())->toBeFalse()
        ->and($petugas->isAdmin())->toBeFalse();

    $admin = new User(['role' => 'admin']);
    expect($admin->isAdmin())->toBeTrue()
        ->and($admin->isPengguna())->toBeFalse()
        ->and($admin->isPetugas())->toBeFalse();
});

test('verification status helper methods identify status accurately', function () {
    $pending = new User(['verification_status' => 'pending']);
    expect($pending->isPending())->toBeTrue()
        ->and($pending->isApproved())->toBeFalse()
        ->and($pending->isRejected())->toBeFalse();

    $approved = new User(['verification_status' => 'approved']);
    expect($approved->isApproved())->toBeTrue()
        ->and($approved->isPending())->toBeFalse()
        ->and($approved->isRejected())->toBeFalse();

    $rejected = new User(['verification_status' => 'rejected']);
    expect($rejected->isRejected())->toBeTrue()
        ->and($rejected->isPending())->toBeFalse()
        ->and($rejected->isApproved())->toBeFalse();
});

test('owns helper checks model ownership correctly', function () {
    $user = new User;
    $user->id = 10;

    $ownedResource = (object) ['user_id' => 10];
    $unownedResource = (object) ['user_id' => 99];

    expect($user->owns($ownedResource))->toBeTrue()
        ->and($user->owns($unownedResource))->toBeFalse()
        ->and($user->owns(null))->toBeFalse();
});

test('nama and name attributes stay in sync', function () {
    $user1 = new User(['nama' => 'Budi Utomo']);
    expect($user1->name)->toBe('Budi Utomo')
        ->and($user1->nama)->toBe('Budi Utomo');

    $user2 = new User(['name' => 'Dewi Sartika']);
    expect($user2->nama)->toBe('Dewi Sartika')
        ->and($user2->name)->toBe('Dewi Sartika');
});
