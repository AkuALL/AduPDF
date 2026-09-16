@extends('layouts.auth', ['title' => 'Daftar Akun Pengguna — AduPDF'])

@section('content')
<div class="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
    <div class="bg-[#2D4C79] text-white p-6 text-center">
        <h1 class="text-2xl font-bold">Pendaftaran Pengguna</h1>
        <p class="text-xs text-slate-200 mt-1">Khusus Mahasiswa, Dosen, dan Tenaga Kependidikan</p>
    </div>

    <div class="p-6">
        <div class="mb-5 bg-blue-50 border-l-4 border-[#2D4C79] p-3 rounded text-slate-700 text-xs leading-relaxed">
            <span class="font-semibold text-[#2D4C79]">Catatan Verifikasi:</span>
            Pendaftaran akun Anda akan berstatus <strong>Menunggu Verifikasi (Pending)</strong> dan harus disetujui oleh Administrator sebelum dapat digunakan untuk masuk ke sistem.
        </div>

        @if ($errors->any())
            <div class="mb-4 bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-rose-800 text-sm">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('register') }}" class="space-y-4">
            @csrf

            <div>
                <label for="nama" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input id="nama" type="text" name="nama" value="{{ old('nama') }}" required autofocus
                       class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D4C79] focus:border-transparent text-sm @error('nama') border-rose-500 @enderror"
                       placeholder="Contoh: Budi Santoso">
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Alamat Email Kampus</label>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required
                       class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D4C79] focus:border-transparent text-sm @error('email') border-rose-500 @enderror"
                       placeholder="budi@kampus.ac.id">
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                <div class="relative">
                    <input id="password" type="password" name="password" required
                           class="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D4C79] focus:border-transparent text-sm @error('password') border-rose-500 @enderror"
                           placeholder="Minimal 8 karakter">
                    <button type="button" onclick="togglePassword('password', this)" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" title="Lihat/Sembunyikan kata sandi" aria-label="Lihat kata sandi">
                        <svg class="h-5 w-5 eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg class="h-5 w-5 eye-off-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                    </button>
                </div>
            </div>

            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                <div class="relative">
                    <input id="password_confirmation" type="password" name="password_confirmation" required
                           class="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D4C79] focus:border-transparent text-sm"
                           placeholder="Ulangi kata sandi">
                    <button type="button" onclick="togglePassword('password_confirmation', this)" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" title="Lihat/Sembunyikan kata sandi" aria-label="Lihat kata sandi">
                        <svg class="h-5 w-5 eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg class="h-5 w-5 eye-off-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="pt-2">
                <button type="submit"
                        class="w-full bg-[#2D4C79] hover:bg-[#1e3454] text-white font-medium py-2.5 px-4 rounded-md transition duration-150 ease-in-out shadow-sm text-sm">
                    Daftar Sekarang
                </button>
            </div>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
            Sudah memiliki akun?
            <a href="{{ route('login') }}" class="text-[#2D4C79] font-semibold hover:underline ml-1">
                Masuk di sini
            </a>
        </div>
    </div>
</div>
@endsection
