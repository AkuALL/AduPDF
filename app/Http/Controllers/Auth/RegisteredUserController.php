<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request (FR-17, BR-05, BR-06).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:100', 'unique:users,email'],
            'identity_type' => ['required', 'string', Rule::in(['nim', 'nip', 'no_pegawai'])],
            'institutional_id' => ['required', 'string', 'regex:/^[0-9]+$/', 'max:100'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'nama.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email ini sudah terdaftar di sistem.',
            'identity_type.required' => 'Jenis identitas kampus wajib dipilih.',
            'identity_type.in' => 'Pilihan jenis identitas kampus tidak valid.',
            'institutional_id.required' => 'Nomor identitas kampus wajib diisi.',
            'institutional_id.regex' => 'Nomor identitas kampus hanya boleh berisi angka.',
            'institutional_id.max' => 'Nomor identitas kampus maksimal 100 karakter.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        User::create([
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'identity_type' => $validated['identity_type'],
            'institutional_id' => $validated['institutional_id'],
            'password' => Hash::make($validated['password']),
            'role' => 'pengguna',
        ]);

        return redirect()->route('login')->with(
            'status',
            'Pendaftaran berhasil. Akun Anda menunggu persetujuan Admin sebelum dapat digunakan.'
        );
    }
}
