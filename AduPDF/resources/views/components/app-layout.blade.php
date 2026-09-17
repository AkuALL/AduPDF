@props(['title' => null])

<x-layouts.app :title="$title" {{ $attributes }}>
    @if(isset($header))
        <x-slot:header>
            {{ $header }}
        </x-slot:header>
    @endif

    {{ $slot }}
</x-layouts.app>
