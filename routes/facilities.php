<?php

use App\Http\Controllers\FacilityController;
use Illuminate\Support\Facades\Route;

Route::get('/facilities', [FacilityController::class, 'index'])->name('facilities.index');
Route::get('/facilities/{facility}', [FacilityController::class, 'show'])->name('facilities.show');
