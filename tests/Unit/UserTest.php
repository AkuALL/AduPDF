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

test('institutional identity helper identifies completed identity accurately (GAL-05)', function () {
    $userWithoutIdentity = new User;
    expect($userWithoutIdentity->hasInstitutionalIdentity())->toBeFalse();

    $userWithOnlyId = new User(['institutional_id' => '24060121140100']);
    expect($userWithOnlyId->hasInstitutionalIdentity())->toBeFalse();

    $userWithOnlyType = new User(['identity_type' => 'nim']);
    expect($userWithOnlyType->hasInstitutionalIdentity())->toBeFalse();

    $userWithFullNim = new User([
        'identity_type' => 'nim',
        'institutional_id' => '24060121140100',
    ]);
    expect($userWithFullNim->hasInstitutionalIdentity())->toBeTrue();

    $userWithFullNip = new User([
        'identity_type' => 'nip',
        'institutional_id' => '198501012010121001',
    ]);
    expect($userWithFullNip->hasInstitutionalIdentity())->toBeTrue();

    $userWithNoPegawai = new User([
        'identity_type' => 'no_pegawai',
        'institutional_id' => 'PEG-9988',
    ]);
    expect($userWithNoPegawai->hasInstitutionalIdentity())->toBeTrue();
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
