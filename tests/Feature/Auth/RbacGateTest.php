<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

test('RBAC and ownership gates evaluate accurately (GAL-04)', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create();
    $pengguna = User::factory()->pengguna()->create();

    expect(Gate::forUser($admin)->allows('admin'))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('manage-accounts'))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('petugas'))->toBeFalse()
        ->and(Gate::forUser($admin)->allows('pengguna'))->toBeFalse()
        ->and(Gate::forUser($petugas)->allows('petugas'))->toBeTrue()
        ->and(Gate::forUser($petugas)->allows('admin'))->toBeFalse()
        ->and(Gate::forUser($petugas)->allows('manage-accounts'))->toBeFalse()
        ->and(Gate::forUser($pengguna)->allows('pengguna'))->toBeTrue()
        ->and(Gate::forUser($pengguna)->allows('petugas'))->toBeFalse()
        ->and(Gate::forUser($pengguna)->allows('admin'))->toBeFalse();

    $ownedResource = (object) ['user_id' => $pengguna->id];
    $unownedResource = (object) ['user_id' => 9999];

    expect(Gate::forUser($pengguna)->allows('owns', [$ownedResource]))->toBeTrue()
        ->and(Gate::forUser($pengguna)->allows('owns', [$unownedResource]))->toBeFalse()
        ->and(Gate::forUser($pengguna)->allows('has-institutional-identity'))->toBeFalse();

    $pengguna->identity_type = 'nim';
    $pengguna->institutional_id = '24060121140001';
    expect(Gate::forUser($pengguna)->allows('has-institutional-identity'))->toBeTrue();
});
