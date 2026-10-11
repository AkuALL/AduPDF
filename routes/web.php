<?php

use App\Models\Facility;
use Illuminate\Support\Facades\Route;

Route::get('/robots.txt', function () {
    $sitemapUrl = rtrim(config('app.url'), '/').'/sitemap.xml';

    return response("User-agent: *\nDisallow:\nSitemap: {$sitemapUrl}\n")
        ->header('Content-Type', 'text/plain; charset=UTF-8');
})->name('robots');

Route::get('/sitemap.xml', function () {
    $baseUrl = rtrim(config('app.url'), '/');
    $facilityUrls = Facility::query()
        ->orderBy('id')
        ->pluck('id')
        ->map(fn (int|string $facilityId): string => $baseUrl.route('facilities.show', ['facility' => $facilityId], false));
    $urls = collect([$baseUrl.route('facilities.index', [], false)])
        ->concat($facilityUrls);

    return response()->view('sitemap', ['urls' => $urls])
        ->header('Content-Type', 'application/xml; charset=UTF-8');
})->name('sitemap');

Route::get('/', function () {
    $user = request()->user();

    if ($user?->isAdmin() || $user?->isPetugas()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('facilities.index');
})->name('home');

// Modular Route Aggregation (Jobdesc Section 8)
require __DIR__.'/auth.php';
require __DIR__.'/admin-accounts.php';

if (file_exists(__DIR__.'/facilities.php')) {
    require __DIR__.'/facilities.php';
}
if (file_exists(__DIR__.'/admin-facilities.php')) {
    require __DIR__.'/admin-facilities.php';
}
if (file_exists(__DIR__.'/reservations.php')) {
    require __DIR__.'/reservations.php';
}
if (file_exists(__DIR__.'/reports.php')) {
    require __DIR__.'/reports.php';
}
if (file_exists(__DIR__.'/dashboards.php')) {
    require __DIR__.'/dashboards.php';
}
if (file_exists(__DIR__.'/admin-recap.php')) {
    require __DIR__.'/admin-recap.php';
}
