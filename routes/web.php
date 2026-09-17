<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
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
