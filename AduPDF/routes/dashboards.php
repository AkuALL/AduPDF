<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Dashboards Routes (Owned by Daniel)
|--------------------------------------------------------------------------
| Handles role-based dashboard redirection and operational queues.
| Detailed implementations for DA-02 (Petugas Dashboard) will be wired
| when backend query contracts from AL (AL-07) and Abhi (AB-06) are ready.
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            if (Route::has('admin.users.index')) {
                return redirect()->route('admin.users.index');
            }

            if (Route::has('admin.facilities.index')) {
                return redirect()->route('admin.facilities.index');
            }

            return redirect()->route('facilities.index');
        }

        if ($user->isPetugas()) {
            if (Route::has('petugas.reservations.index')) {
                return redirect()->route('petugas.reservations.index');
            }

            return redirect()->route('facilities.index');
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
