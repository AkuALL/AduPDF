<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Recap & Export Routes (Owned by Daniel)
|--------------------------------------------------------------------------
| Handles facility occupancy recap, damage statistics, and exports (DA-03, DA-04).
| Full logic will be connected once cross-domain statistics contracts are available.
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Recap routes will be declared here during DA-03 and DA-04 implementation
});
