@props([
    'title' => null,
    'header' => null,
])

<!DOCTYPE html>
<html lang="id" class="h-full bg-[#F7F8FA]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ isset($title) && !empty($title) ? $title . ' — AduPDF' : 'AduPDF — Sistem Reservasi & Pelaporan Fasilitas Kampus' }}</title>

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN Configured for AduPDF (Quiet Campus Utility) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: '#2D4C79',
                            hover: '#243E63',
                            active: '#1C3150',
                            soft: '#E9EEF5',
                            'soft-hover': '#DCE4EE',
                            dark: '#1e3454',
                            light: '#41669d',
                        },
                        surface: {
                            DEFAULT: '#FFFFFF',
                            subtle: '#F3F5F7',
                            muted: '#EEF1F4',
                            inverse: '#1F2937',
                        },
                        semantic: {
                            success: '#16794A',
                            'success-soft': '#EAF7F0',
                            'success-border': '#B7E2CB',
                            warning: '#A15C00',
                            'warning-soft': '#FFF5E6',
                            'warning-border': '#F5D6A6',
                            info: '#2463A7',
                            'info-soft': '#EBF3FB',
                            'info-border': '#BFD6ED',
                            danger: '#B42318',
                            'danger-hover': '#912018',
                            'danger-soft': '#FDECEC',
                            'danger-border': '#F2B8B5',
                            repair: '#B54708',
                            'repair-soft': '#FFF0E8',
                            'repair-border': '#F5C6A7',
                            neutral: '#5D6673',
                            'neutral-soft': '#F0F2F4',
                            'neutral-border': '#D7DBE0',
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <style>
        body {
            font-family: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #F7F8FA;
            color: #111827;
        }
    </style>

    @stack('styles')
</head>
<body class="min-h-full flex flex-col text-[#111827] bg-[#F7F8FA] antialiased">
    <!-- Shared Top Navigation Shell -->
    @include('layouts.navigation')

    <!-- Optional Page Header / Breadcrumbs -->
    @if(isset($header) && !empty(trim((string)$header)))
        <div class="bg-white border-b border-[#E5E7EB] py-5 shadow-2xs">
            <div class="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                {{ $header }}
            </div>
        </div>
    @endif

    <!-- Main Content Container -->
    <main class="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Global Flash Messages Notification Banner -->
        <x-flash-messages />

        <!-- Page Body Content -->
        {{ $slot }}
    </main>

    <!-- Institutional Footer -->
    <footer class="bg-white border-t border-[#E5E7EB] py-6 mt-auto">
        <div class="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
            <div class="flex items-center gap-2">
                <span class="font-bold text-[#2D4C79]">AduPDF</span>
                <span>—</span>
                <span>Sistem Reservasi & Pelaporan Fasilitas Kampus</span>
            </div>
            <div>
                &copy; {{ date('Y') }} Tim Pengembang AduPDF. Hak Cipta Dilindungi.
            </div>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>
