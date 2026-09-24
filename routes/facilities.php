<?php

use App\Http\Controllers\FacilityController;
use App\Http\Middleware\RedirectAdminAndPetugasFromFacilities;
use Illuminate\Support\Facades\Route;

Route::middleware(RedirectAdminAndPetugasFromFacilities::class)->group(function () {
    Route::get('/facilities', [FacilityController::class, 'index'])->name('facilities.index');
    Route::get('/facilities/{facility}', [FacilityController::class, 'show'])->name('facilities.show');
});
