<?php

use App\Models\Facility;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user with pending_reservation cookie is redirected to profile when logging in without institutional identity', function () {
    $user = User::factory()->pengguna()->create([
        'password' => bcrypt('password123'),
        'approved_at' => now(),
        'institutional_id' => null,
        'identity_type' => null,
    ]);

    $pendingData = [
        'facility_id' => 1,
        'facility_name' => 'Ruang Kelas A',
        'schedules' => [
            ['date' => '2026-10-15', 'start_time' => '08:00', 'end_time' => '10:00'],
        ],
        'url' => '/reservations/create?facility_id=1&start_time=2026-10-15T08:00&end_time=2026-10-15T10:00',
    ];

    $response = $this
        ->withUnencryptedCookie('pending_reservation', json_encode($pendingData))
        ->post('/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

    $response->assertRedirect(route('profile.edit'));
    $response->assertSessionHas('warning', 'Lengkapi profil untuk melanjutkan reservasi');
    $response->assertSessionHas('from', 'reservation');
});

test('user with pending_reservation cookie and complete identity is redirected directly to reservation upon login', function () {
    $user = User::factory()->pengguna()->withInstitutionalIdentity('nim', '24060121140001')->create([
        'password' => bcrypt('password123'),
        'approved_at' => now(),
    ]);

    $targetUrl = '/reservations/create?facility_id=1&start_time=2026-10-15T08:00&end_time=2026-10-15T10:00';
    $pendingData = [
        'facility_id' => 1,
        'schedules' => [
            ['date' => '2026-10-15', 'start_time' => '08:00', 'end_time' => '10:00'],
        ],
        'url' => $targetUrl,
    ];

    $response = $this
        ->withUnencryptedCookie('pending_reservation', json_encode($pendingData))
        ->post('/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

    $response->assertRedirect($targetUrl);
});

test('completing profile with from reservation auto-redirects to the pending reservation', function () {
    $user = User::factory()->pengguna()->create([
        'institutional_id' => null,
        'identity_type' => null,
    ]);

    $targetUrl = '/reservations/create?facility_id=2&start_time=2026-10-15T08:00&end_time=2026-10-15T10:00';
    $pendingData = [
        'facility_id' => 2,
        'schedules' => [
            ['date' => '2026-10-15', 'start_time' => '08:00', 'end_time' => '10:00'],
        ],
        'url' => $targetUrl,
    ];

    $response = $this
        ->actingAs($user)
        ->withUnencryptedCookie('pending_reservation', json_encode($pendingData))
        ->patch('/profile', [
            'nama' => 'Budi Utomo',
            'email' => $user->email,
            'identity_type' => 'nim',
            'institutional_id' => '24060121140099',
            'whatsapp' => '081234567890',
            'from' => 'reservation',
        ]);

    $response->assertRedirect($targetUrl);
    $response->assertSessionHas('success', 'Profil berhasil dilengkapi. Silakan lanjutkan reservasi Anda.');
});

test('updating profile normally without from reservation redirects to profile.edit', function () {
    $user = User::factory()->pengguna()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'nama' => 'Budi Utomo',
            'email' => $user->email,
            'identity_type' => 'nim',
            'institutional_id' => '24060121140099',
            'whatsapp' => '081234567890',
        ]);

    $response->assertRedirect(route('profile.edit'));
});

test('submitting reservation clears pending_reservation cookie', function () {
    $user = User::factory()->pengguna()->withInstitutionalIdentity('nim', '24060121140001')->create();
    $facility = Facility::factory()->create(['condition' => 'aktif']);

    $tomorrow = now('Asia/Jakarta')->addDays(2)->format('Y-m-d');

    $response = $this
        ->actingAs($user)
        ->withUnencryptedCookie('pending_reservation', 'some-data')
        ->post('/reservations', [
            'facility_id' => $facility->id,
            'start_time' => "{$tomorrow}T08:00",
            'end_time' => "{$tomorrow}T10:00",
            'tujuan' => 'Praktikum Pemrograman',
        ]);

    $response->assertRedirect(route('reservations.create', ['facility_id' => $facility->id]));
    $response->assertCookieExpired('pending_reservation');
});

test('submitting multi-day reservation creates individual reservations for each schedule', function () {
    $user = User::factory()->pengguna()->withInstitutionalIdentity('nim', '24060121140001')->create();
    $facility = Facility::factory()->create(['condition' => 'aktif']);

    $day1 = now('Asia/Jakarta')->addDays(2)->format('Y-m-d');
    $day2 = now('Asia/Jakarta')->addDays(4)->format('Y-m-d');

    $schedules = [
        ['date' => $day1, 'start_time' => '07:00', 'end_time' => '08:30'],
        ['date' => $day2, 'start_time' => '07:00', 'end_time' => '08:00'],
    ];

    $response = $this
        ->actingAs($user)
        ->post('/reservations', [
            'facility_id' => $facility->id,
            'start_time' => "{$day1}T07:00",
            'end_time' => "{$day1}T08:30",
            'schedules' => json_encode($schedules),
            'tujuan' => 'Kegiatan Multi Hari',
        ]);

    $response->assertRedirect(route('reservations.create', ['facility_id' => $facility->id]));
    $response->assertSessionHas('success');

    expect(Reservation::where('user_id', $user->id)->count())->toBe(2);
});
