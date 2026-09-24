<?php

use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('report owner can view a supporting photo', function () {
    Storage::fake('local');
    $user = User::factory()->pengguna()->create();
    $attachment = ReportAttachment::factory()
        ->for(Report::factory()->for($user))
        ->create([
            'file_path' => 'reports/proyektor.jpg',
            'original_name' => 'proyektor.jpg',
            'mime_type' => 'image/jpeg',
        ]);
    Storage::disk('local')->put($attachment->file_path, 'photo-content');

    $response = $this->actingAs($user)->get(route('reports.attachments.show', $attachment));

    $response->assertOk()->assertHeader('Content-Type', 'image/jpeg');
});

test('Petugas can view a supporting photo', function () {
    Storage::fake('local');
    $petugas = User::factory()->petugas()->create();
    $attachment = ReportAttachment::factory()->create(['file_path' => 'reports/kabel.png']);
    Storage::disk('local')->put($attachment->file_path, 'photo-content');

    $response = $this->actingAs($petugas)->get(route('reports.attachments.show', $attachment));

    $response->assertOk();
});

test('Pengguna cannot view another users supporting photo', function () {
    $user = User::factory()->pengguna()->create();
    $attachment = ReportAttachment::factory()->create();

    $response = $this->actingAs($user)->get(route('reports.attachments.show', $attachment));

    $response->assertForbidden();
});

test('guests are redirected to login when viewing a supporting photo', function () {
    $attachment = ReportAttachment::factory()->create();

    $response = $this->get(route('reports.attachments.show', $attachment));

    $response->assertRedirect(route('login'));
});
