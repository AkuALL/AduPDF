<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\PetugasDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Dashboards Routes (Owned by Daniel)
|--------------------------------------------------------------------------
| Handles role-based dashboard redirection and operational queues.
| - DA-02: Petugas operational dashboard
| - DA-03: Admin executive dashboard
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            if (Route::has('admin.dashboard')) {
                return redirect()->route('admin.dashboard');
            }

            if (Route::has('admin.users.index')) {
                return redirect()->route('admin.users.index');
            }

            if (Route::has('admin.facilities.index')) {
                return redirect()->route('admin.facilities.index');
            }

            abort(404);
        }

        if ($user->isPetugas()) {
            if (Route::has('petugas.dashboard')) {
                return redirect()->route('petugas.dashboard');
            }

            if (Route::has('petugas.reservations.index')) {
                return redirect()->route('petugas.reservations.index');
            }

            abort(404);
        }

        if ($user->isPengguna()) {
            if (Route::has('reservations.index')) {
                return redirect()->route('reservations.index');
            }

            return redirect()->route('facilities.index');
        }

        return redirect()->route('facilities.index');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:petugas'])->prefix('petugas')->name('petugas.')->group(function () {
    Route::get('/dashboard', [PetugasDashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
});
