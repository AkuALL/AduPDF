<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Admin Panel' }} — AduPDF</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: '#2D4C79',
                            dark: '#1e3454',
                            light: '#41669d',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
    </style>
</head>
<body class="bg-slate-100 min-h-screen flex flex-col text-slate-800 antialiased">
    <!-- Top Navbar -->
    <header class="bg-[#2D4C79] text-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex items-center space-x-6">
                    <a href="{{ route('admin.verifications.index') }}" class="flex items-center space-x-2">
                        <span class="text-2xl font-bold tracking-wider">AduPDF</span>
                        <span class="text-xs bg-amber-500/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded font-semibold">ADMIN</span>
                    </a>
                    <nav class="hidden md:flex space-x-2 text-sm font-medium">
                        <a href="{{ route('admin.verifications.index') }}" class="px-3 py-2 rounded-md transition {{ request()->routeIs('admin.verifications.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}">
                            Antrian Verifikasi
                        </a>
                        <a href="{{ route('admin.users.petugas.create') }}" class="px-3 py-2 rounded-md transition {{ request()->routeIs('admin.users.petugas.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}">
                            Tambah Petugas
                        </a>
                        <a href="{{ route('admin.users.pengguna.create') }}" class="px-3 py-2 rounded-md transition {{ request()->routeIs('admin.users.pengguna.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}">
                            Tambah Pengguna
                        </a>
                        <a href="{{ route('admin.facilities.index') }}" class="px-3 py-2 rounded-md transition {{ request()->routeIs('admin.facilities.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}">
                            Kelola Fasilitas
                        </a>
                        <a href="{{ route('admin.password.edit') }}" class="px-3 py-2 rounded-md transition {{ request()->routeIs('admin.password.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}">
                            Ganti Password
                        </a>
                    </nav>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="text-right hidden sm:block">
                        <div class="text-sm font-semibold">{{ auth()->user()->nama ?? auth()->user()->name }}</div>
                        <div class="text-xs text-slate-300">Administrator Tunggal</div>
                    </div>
                    <form action="{{ route('logout') }}" method="POST" class="inline">
                        @csrf
                        <button type="submit" class="text-xs bg-red-600/80 hover:bg-red-700 text-white px-3 py-1.5 rounded transition">
                            Keluar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Flash Feedback -->
        @if(session('success'))
            <div class="mb-4 bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded shadow-sm text-emerald-800 text-sm flex items-start space-x-2">
                <svg class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        @if(session('error'))
            <div class="mb-4 bg-rose-50 border-l-4 border-rose-600 p-4 rounded shadow-sm text-rose-800 text-sm flex items-start space-x-2">
                <svg class="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{{ session('error') }}</span>
            </div>
        @endif

        @yield('content')
    </main>

    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        &copy; {{ date('Y') }} AduPDF. Sistem Reservasi & Pelaporan Fasilitas Kampus.
    </footer>

    <script>
        function togglePassword(inputId, btn) {
            const input = document.getElementById(inputId);
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            const eye = btn.querySelector('.eye-icon');
            const eyeOff = btn.querySelector('.eye-off-icon');
            if (eye && eyeOff) {
                eye.classList.toggle('hidden', isPassword);
                eyeOff.classList.toggle('hidden', !isPassword);
            }
        }
    </script>
</body>
</html>
