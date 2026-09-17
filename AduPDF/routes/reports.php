<?php

use App\Http\Controllers\PetugasReportController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'approved', 'role:pengguna'])->group(function () {
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/create', [ReportController::class, 'create'])->name('reports.create');
    Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
    Route::get('/reports/{report}', [ReportController::class, 'show'])->name('reports.show');
});

Route::middleware(['auth', 'role:petugas'])->prefix('petugas')->name('petugas.')->group(function () {
    Route::get('/reports', [PetugasReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{report}', [PetugasReportController::class, 'show'])->name('reports.show');
    Route::patch('/reports/{report}', [PetugasReportController::class, 'update'])->name('reports.update');
    Route::patch('/reports/{report}/facility-condition', [PetugasReportController::class, 'updateFacilityCondition'])->name('reports.facility-condition.update');
});
