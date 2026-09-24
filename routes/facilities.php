<?php

use App\Http\Controllers\FacilityController;
use App\Http\Middleware\RedirectPetugasFromFacilities;
use Illuminate\Support\Facades\Route;

Route::middleware(RedirectPetugasFromFacilities::class)->group(function () {
    Route::get('/facilities', [FacilityController::class, 'index'])->name('facilities.index');
    Route::get('/facilities/{facility}', [FacilityController::class, 'show'])->name('facilities.show');
});
