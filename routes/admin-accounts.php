<?php

use App\Http\Controllers\Admin\AccountManagementController;
use App\Http\Controllers\Admin\PasswordController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Account Management Routes (Owned by Galang)
|--------------------------------------------------------------------------
| Handles verification queue, user creation (Petugas/Pengguna), and Admin password.
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // GAL-05: Verification Queue (FR-17, US-15)
    Route::get('/verifications', [AccountManagementController::class, 'verifications'])->name('verifications.index');
    Route::patch('/users/{user}/verify', [AccountManagementController::class, 'verify'])->name('users.verify');
    Route::patch('/users/{user}/reject', [AccountManagementController::class, 'reject'])->name('users.reject');

    // GAL-05: Create Petugas (FR-15, US-13)
    Route::get('/users/petugas/create', [AccountManagementController::class, 'createPetugas'])->name('users.petugas.create');
    Route::post('/users/petugas', [AccountManagementController::class, 'storePetugas'])->name('users.petugas.store');

    // GAL-05: Create Pengguna directly by Admin (FR-16, US-14)
    Route::get('/users/pengguna/create', [AccountManagementController::class, 'createPengguna'])->name('users.pengguna.create');
    Route::post('/users/pengguna', [AccountManagementController::class, 'storePengguna'])->name('users.pengguna.store');

    // GAL-06: Admin Change Password (BR-18)
    Route::get('/change-password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/change-password', [PasswordController::class, 'update'])->name('password.update');
});
