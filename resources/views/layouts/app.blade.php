<x-layouts.app :title="$title ?? null">
    @if(View::hasSection('header'))
        <x-slot:header>
            @yield('header')
        </x-slot:header>
    @endif

    @yield('content')
</x-layouts.app>
