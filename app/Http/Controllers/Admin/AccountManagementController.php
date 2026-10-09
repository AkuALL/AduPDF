<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ReservationImpactService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AccountManagementController extends Controller
{
    /**
     * Display all accounts except the current Admin account (GAL-06).
     */
    public function index(Request $request): Response
    {
        $users = User::withTrashed()
            ->whereIn('role', ['petugas', 'pengguna', 'admin'])
            ->where('id', '!=', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('admin/accounts/index', compact('users'));
    }

    /**
     * Legacy route fallback / redirect for verification queue.
     */
    public function verifications(): RedirectResponse|Response
    {
        return redirect()->route('admin.users.index');
    }

    /**
     * Show the form for creating a new Petugas account (FR-15, US-13, GAL-06).
     */
    public function createPetugas(): Response
    {
        return Inertia::render('admin/accounts/create-petugas');
    }

    /**
     * Store a newly created Petugas account in storage (FR-15, US-13, GAL-06).
     */
    public function storePetugas(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'nama.required' => 'Nama Petugas wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email ini sudah terdaftar di sistem.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $petugas = new User([
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'petugas',
        ]);
        $petugas->forceFill([
            'email_verified_at' => now(),
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ])->save();

        return redirect()->route('admin.users.index')->with('success', 'Akun Petugas ('.$validated['nama'].') berhasil dibuat.');
    }

    /**
     * Show the form for creating a new Pengguna account directly by Admin (FR-16, US-14, GAL-06).
     */
    public function createPengguna(): Response
    {
        return Inertia::render('admin/accounts/create-pengguna');
    }

    /**
     * Store a newly created Pengguna account directly by Admin (FR-16, US-14, GAL-06).
     */
    public function storePengguna(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'nama.required' => 'Nama Pengguna wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email ini sudah terdaftar di sistem.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $pengguna = new User([
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'pengguna',
        ]);
        $pengguna->forceFill([
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ])->save();

        $pengguna->sendEmailVerificationNotification();

        return redirect()->route('admin.users.index')->with(
            'success',
            'Akun Pengguna ('.$validated['nama'].') berhasil dibuat langsung oleh Admin.'
        );
    }

    /** Approve a self-registered Pengguna and start email verification. */
    public function approve(Request $request, User $user): RedirectResponse
    {
        $approvedUser = DB::transaction(function () use ($request, $user): ?User {
            $target = User::query()->whereKey($user->id)->lockForUpdate()->firstOrFail();

            if (! $target->isPengguna() || $target->isApproved()) {
                return null;
            }

            $target->forceFill([
                'approved_at' => now(),
                'approved_by' => $request->user()->id,
            ])->save();

            return $target;
        });

        if (! $approvedUser) {
            return back()->with('error', 'Akun ini bukan akun Pengguna yang menunggu persetujuan.');
        }

        if (! $approvedUser->hasVerifiedEmail()) {
            $approvedUser->sendEmailVerificationNotification();
        }

        return redirect()->route('admin.users.index')->with(
            'success',
            'Akun Pengguna '.$approvedUser->nama.' berhasil disetujui. Email verifikasi telah dikirim.'
        );
    }

    /** Reactivate an account previously deactivated by Admin. */
    public function activate(int $userId): RedirectResponse
    {
        $user = User::withTrashed()->findOrFail($userId);

        if (! $user->trashed()) {
            return back()->with('error', 'Akun tersebut sudah aktif.');
        }

        $user->restore();

        return redirect()->route('admin.users.index')->with(
            'success',
            'Akun '.$user->nama.' berhasil diaktifkan kembali.'
        );
    }

    /** Deactivate an account and apply its reservation status changes atomically. */
    public function deactivate(Request $request, User $user, ReservationImpactService $impacts): RedirectResponse
    {
        if ((int) $request->user()->id === (int) $user->id) {
            return back()->with('error', 'Admin tidak dapat menonaktifkan akunnya sendiri.');
        }

        $result = DB::transaction(function () use ($user, $impacts): ?array {
            $activeAdmins = User::query()
                ->where('role', 'admin')
                ->orderBy('id')
                ->lockForUpdate()
                ->get(['id']);
            $target = User::query()->whereKey($user->id)->lockForUpdate()->firstOrFail();

            if ($target->isAdmin() && $activeAdmins->count() <= 1) {
                return null;
            }

            return $impacts->deactivateUser($target);
        });

        if ($result === null) {
            return back()->with('error', 'Admin terakhir tidak dapat dinonaktifkan.');
        }

        $name = $user->nama ?? $user->email;

        return redirect()->route('admin.users.index')->with(
            'success',
            "Akun {$name} berhasil dinonaktifkan. {$result['rejected']} reservasi menunggu ditolak dan {$result['cancelled']} reservasi disetujui dibatalkan."
        );
    }
}
