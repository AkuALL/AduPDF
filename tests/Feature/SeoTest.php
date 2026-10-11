<?php

use App\Models\Facility;
use Inertia\Testing\AssertableInertia as Assert;

test('the public catalog renders AduPDF search metadata', function () {
    config([
        'app.name' => 'AduPDF',
        'app.url' => 'https://adupdf-production.up.railway.app/',
    ]);

    $this->get('/facilities')
        ->assertOk()
        ->assertSee('<title>AduPDF — Sistem Reservasi dan Pelaporan Fasilitas Kampus</title>', false)
        ->assertSee('name="description" content="AduPDF membantu sivitas kampus menemukan fasilitas, mengajukan reservasi, dan melaporkan kerusakan fasilitas kampus."', false)
        ->assertSee('property="og:site_name" content="AduPDF"', false)
        ->assertSee('"@type":"WebSite"', false)
        ->assertSee('"url":"https://adupdf-production.up.railway.app/"', false)
        ->assertInertia(fn (Assert $page) => $page
            ->component('facilities/index')
            ->where('siteUrl', 'https://adupdf-production.up.railway.app/')
        );
});

test('the sitemap lists the public catalog and facility pages with the configured app url', function () {
    config(['app.url' => 'https://adupdf-production.up.railway.app/']);
    $facility = Facility::factory()->create();

    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee('<loc>https://adupdf-production.up.railway.app/facilities</loc>', false)
        ->assertSee("<loc>https://adupdf-production.up.railway.app/facilities/{$facility->id}</loc>", false)
        ->assertDontSee('?');
});

test('robots lists the sitemap for the configured app url', function () {
    config(['app.url' => 'https://adupdf-production.up.railway.app/']);

    $this->get('/robots.txt')
        ->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
        ->assertSee("User-agent: *\nDisallow:\nSitemap: https://adupdf-production.up.railway.app/sitemap.xml\n", false);
});
