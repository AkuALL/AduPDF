<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3">
        <link rel="apple-touch-icon" href="/favicon.svg?v=3">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @if (request()->routeIs('facilities.index'))
            <meta name="description" content="AduPDF membantu sivitas kampus menemukan fasilitas, mengajukan reservasi, dan melaporkan kerusakan fasilitas kampus." data-inertia="description">
            <meta property="og:site_name" content="AduPDF" data-inertia="site-name">
            <script type="application/ld+json" data-inertia="website-schema">@json(['@context' => 'https://schema.org', '@type' => 'WebSite', 'name' => 'AduPDF', 'url' => rtrim(config('app.url'), '/').'/'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT)</script>
        @endif
        <x-inertia::head>
            <title>{{ request()->routeIs('facilities.index') ? 'AduPDF — Sistem Reservasi dan Pelaporan Fasilitas Kampus' : config('app.name', 'AduPDF') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
