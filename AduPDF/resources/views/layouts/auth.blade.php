<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'AduPDF — Sistem Fasilitas Kampus' }}</title>
    <!-- Tailwind CSS CDN for instant robust styling -->
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
<body class="bg-slate-100 min-h-screen flex flex-col justify-between text-slate-800 antialiased">
    <header class="bg-[#2D4C79] text-white shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="{{ url('/') }}" class="flex items-center space-x-3">
                <span class="text-2xl font-bold tracking-wider">AduPDF</span>
                <span class="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-medium">Kampus</span>
            </a>
            <div class="text-xs text-slate-200">
                Sistem Reservasi & Pelaporan Fasilitas
            </div>
        </div>
    </header>

    <main class="flex-1 flex items-center justify-center p-4">
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
