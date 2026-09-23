<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Blade;

uses(RefreshDatabase::class);

test('guest can see public navigation items in shared shell', function () {
    $view = Blade::render('<x-layouts.app><div>Halaman Utama Konten</div></x-layouts.app>');

    expect($view)->toContain('AduPDF')
        ->and($view)->toContain('Fasilitas')
        ->and($view)->toContain('Masuk')
        ->and($view)->toContain('Daftar Akun')
        ->and($view)->toContain('Halaman Utama Konten')
        ->and($view)->not->toContain('Reservasi Saya')
        ->and($view)->not->toContain('Antrean Reservasi')
        ->and($view)->not->toContain('Antrian Verifikasi');
});

test('base layout works with traditional @extends directive', function () {
    $view = Blade::render("@extends('layouts.app')\n@section('content')\n<div>Konten Menggunakan Extends</div>\n@endsection");

    expect($view)->toContain('AduPDF')
        ->and($view)->toContain('Konten Menggunakan Extends')
        ->and($view)->toContain('Hak Cipta Dilindungi');
});

test('pengguna sees role-aware navigation for reservations and user badge', function () {
    $pengguna = User::factory()->pengguna()->create([
        'nama' => 'Budi Pengguna',
        'email' => 'budi@kampus.ac.id',
    ]);

    $this->actingAs($pengguna);

    $view = Blade::render('<x-layouts.app><div>Konten Pengguna</div></x-layouts.app>');

    expect($view)->toContain('Budi Pengguna')
        ->and($view)->toContain('PENGGUNA')
        ->and($view)->toContain('Fasilitas')
        ->and($view)->toContain('Reservasi Saya')
        ->and($view)->toContain('Ajukan Reservasi')
        ->and($view)->toContain('Keluar')
        ->and($view)->not->toContain('Antrean Reservasi')
        ->and($view)->not->toContain('Antrian Verifikasi');
});

test('petugas sees role-aware navigation for petugas operational queues', function () {
    $petugas = User::factory()->petugas()->create([
        'nama' => 'Siti Petugas',
        'email' => 'siti@kampus.ac.id',
    ]);

    $this->actingAs($petugas);

    $view = Blade::render('<x-layouts.app><div>Konten Petugas</div></x-layouts.app>');

    expect($view)->toContain('Siti Petugas')
        ->and($view)->toContain('PETUGAS')
        ->and($view)->toContain('Fasilitas')
        ->and($view)->toContain('Antrean Reservasi')
        ->and($view)->toContain('Keluar')
        ->and($view)->not->toContain('Reservasi Saya')
        ->and($view)->not->toContain('Antrian Verifikasi');
});

test('admin sees role-aware navigation for admin management tasks', function () {
    $admin = User::factory()->admin()->create([
        'nama' => 'Admin Tunggal',
        'email' => 'admin@kampus.ac.id',
    ]);

    $this->actingAs($admin);

    $view = Blade::render('<x-layouts.app><div>Konten Admin</div></x-layouts.app>');

    expect($view)->toContain('Admin Tunggal')
        ->and($view)->toContain('ADMIN')
        ->and($view)->toContain('Kelola Akun')
        ->and($view)->toContain('Tambah Petugas')
        ->and($view)->toContain('Tambah Pengguna')
        ->and($view)->toContain('Ganti Password')
        ->and($view)->toContain('Keluar')
        ->and($view)->not->toContain('Antrian Verifikasi');
});

test('shared alert component renders semantic states correctly', function () {
    $successAlert = Blade::render('<x-alert type="success" message="Data tersimpan dengan sukses" />');
    expect($successAlert)->toContain('Data tersimpan dengan sukses')
        ->and($successAlert)->toContain('bg-[#EAF7F0]')
        ->and($successAlert)->toContain('text-[#16794A]');

    $warningAlert = Blade::render('<x-alert type="warning" message="Batas waktu reservasi hampir habis" />');
    expect($warningAlert)->toContain('Batas waktu reservasi hampir habis')
        ->and($warningAlert)->toContain('bg-[#FFF5E6]')
        ->and($warningAlert)->toContain('text-[#A15C00]');

    $dangerAlert = Blade::render('<x-alert type="danger" message="Fasilitas sedang tidak dapat dipesan" />');
    expect($dangerAlert)->toContain('Fasilitas sedang tidak dapat dipesan')
        ->and($dangerAlert)->toContain('bg-[#FDECEC]')
        ->and($dangerAlert)->toContain('text-[#B42318]');

    $infoAlert = Blade::render('<x-alert type="info" message="Periksa jadwal terlebih dahulu" />');
    expect($infoAlert)->toContain('Periksa jadwal terlebih dahulu')
        ->and($infoAlert)->toContain('bg-[#EBF3FB]')
        ->and($infoAlert)->toContain('text-[#2463A7]');
});

test('shared status badge component renders label and explicit symbol icon', function () {
    $menunggu = Blade::render('<x-status-badge status="menunggu" />');
    expect($menunggu)->toContain('Menunggu')
        ->and($menunggu)->toContain('○')
        ->and($menunggu)->toContain('#A15C00');

    $disetujui = Blade::render('<x-status-badge status="disetujui" />');
    expect($disetujui)->toContain('Disetujui')
        ->and($disetujui)->toContain('✓')
        ->and($disetujui)->toContain('#16794A');

    $dalamPerbaikan = Blade::render('<x-status-badge status="dalam_perbaikan" />');
    expect($dalamPerbaikan)->toContain('Dalam perbaikan')
        ->and($dalamPerbaikan)->toContain('!')
        ->and($dalamPerbaikan)->toContain('#B54708');

    $nonaktif = Blade::render('<x-status-badge status="nonaktif" />');
    expect($nonaktif)->toContain('Nonaktif')
        ->and($nonaktif)->toContain('—')
        ->and($nonaktif)->toContain('#5D6673');

    $ditolak = Blade::render('<x-status-badge status="ditolak" />');
    expect($ditolak)->toContain('Ditolak')
        ->and($ditolak)->toContain('×')
        ->and($ditolak)->toContain('#B42318');

    $kedaluwarsa = Blade::render('<x-status-badge status="kedaluwarsa" />');
    expect($kedaluwarsa)->toContain('Kedaluwarsa')
        ->and($kedaluwarsa)->toContain('—')
        ->and($kedaluwarsa)->toContain('#5D6673');
});

test('shared empty state component renders informative copy and CTA link', function () {
    $view = Blade::render('<x-empty-state title="Belum ada reservasi" description="Reservasi yang kamu ajukan akan muncul di sini." action-text="Lihat Fasilitas" action-url="/facilities" />');

    expect($view)->toContain('Belum ada reservasi')
        ->and($view)->toContain('Reservasi yang kamu ajukan akan muncul di sini.')
        ->and($view)->toContain('Lihat Fasilitas')
        ->and($view)->toContain('/facilities');
});

test('shared form error and input error components display validation errors', function () {
    $inputError = Blade::render('<x-input-error :messages="[\'Format email tidak valid\']" />');
    expect($inputError)->toContain('Format email tidak valid')
        ->and($inputError)->toContain('text-[#B42318]');
});

test('shared button, card, and modal-confirm components render properly', function () {
    $button = Blade::render('<x-button variant="primary">Kirim</x-button>');
    expect($button)->toContain('Kirim')
        ->and($button)->toContain('bg-[#2D4C79]');

    $card = Blade::render('<x-card title="Detail Informasi">Isi konten kartu</x-card>');
    expect($card)->toContain('Detail Informasi')
        ->and($card)->toContain('Isi konten kartu');

    $modal = Blade::render('<x-modal-confirm id="modal-test" title="Hapus Reservasi" resource="Lab Komputer" consequence="Tindakan ini tidak dapat diurungkan." action="/test" />');
    expect($modal)->toContain('Hapus Reservasi')
        ->and($modal)->toContain('Lab Komputer')
        ->and($modal)->toContain('Tindakan ini tidak dapat diurungkan.');
});

test('home route redirects to facilities catalog', function () {
    $this->get(route('home'))
        ->assertRedirect(route('facilities.index'));
});

test('dashboard route redirects authenticated users based on role', function () {
    $pengguna = User::factory()->pengguna()->create();
    $this->actingAs($pengguna)
        ->get(route('dashboard'))
        ->assertRedirect(route('reservations.index'));

    $petugas = User::factory()->petugas()->create();
    $this->actingAs($petugas)
        ->get(route('dashboard'))
        ->assertRedirect(route('petugas.reservations.index'));

    $admin = User::factory()->admin()->create();
    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertRedirect(route('admin.users.index'));
});
