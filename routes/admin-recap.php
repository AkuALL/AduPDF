<?php

use App\Http\Controllers\Admin\RecapController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Recap & Export Routes (Owned by Daniel)
|--------------------------------------------------------------------------
| Handles facility occupancy recap, damage statistics, and exports (DA-03, DA-04).
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/recap', [RecapController::class, 'index'])->name('recap.index');
    Route::get('/recap/export', [RecapController::class, 'export'])->name('recap.export');
});
