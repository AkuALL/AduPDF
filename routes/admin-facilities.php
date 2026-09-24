<?php

use App\Http\Controllers\Admin\FacilityManagementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Facility Management Routes (Owned by Agil - AG-05, FR-18)
|--------------------------------------------------------------------------
| Handles facility CRUD, room-tool relation hierarchy, and state changes.
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/facilities', [FacilityManagementController::class, 'index'])->name('facilities.index');
    Route::get('/facilities/create', [FacilityManagementController::class, 'create'])->name('facilities.create');
    Route::post('/facilities', [FacilityManagementController::class, 'store'])->name('facilities.store');
    Route::get('/facilities/{facility}', [FacilityManagementController::class, 'show'])->name('facilities.show');
    Route::get('/facilities/{facility}/edit', [FacilityManagementController::class, 'edit'])->name('facilities.edit');
    Route::match(['put', 'patch'], '/facilities/{facility}', [FacilityManagementController::class, 'update'])->name('facilities.update');
    Route::delete('/facilities/{facility}', [FacilityManagementController::class, 'destroy'])->name('facilities.destroy');
    Route::patch('/facilities/{facility}/deactivate', [FacilityManagementController::class, 'deactivate'])->name('facilities.deactivate');
    Route::patch('/facilities/{facility}/activate', [FacilityManagementController::class, 'activate'])->name('facilities.activate');
});
