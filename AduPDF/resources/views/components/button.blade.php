@props([
    'variant' => 'primary', // primary, secondary, ghost, destructive, secondary-destructive
    'size' => 'md', // sm, md, lg
    'as' => 'button', // button, a
    'href' => null,
    'type' => 'button',
])

@php
    $variantClasses = match($variant) {
        'secondary' => 'bg-white text-[#111827] border border-[#D0D5DD] hover:bg-[#F3F5F7] active:bg-[#EEF1F4]',
        'ghost' => 'bg-transparent text-[#667085] hover:bg-[#F3F5F7] hover:text-[#111827] active:bg-[#EEF1F4]',
        'destructive', 'danger' => 'bg-[#B42318] text-white border border-transparent hover:bg-[#912018] active:bg-[#7a1b14]',
        'secondary-destructive' => 'bg-white text-[#B42318] border border-[#F2B8B5] hover:bg-[#FDECEC] active:bg-[#fad4d4]',
        default => 'bg-[#2D4C79] text-white border border-transparent hover:bg-[#243E63] active:bg-[#1C3150]',
    };

    $sizeClasses = match($size) {
        'sm' => 'px-3 py-1.5 text-xs h-8',
        'lg' => 'px-5 py-2.5 text-base h-11',
        default => 'px-4 py-2 text-sm h-10',
    };

    $baseClasses = 'inline-flex items-center justify-center font-semibold rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-[#2D4C79]/20 disabled:opacity-50 disabled:cursor-not-allowed select-none ' . $variantClasses . ' ' . $sizeClasses;
@endphp

@if($as === 'a' || $href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $baseClasses]) }}>
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' => $baseClasses]) }}>
        {{ $slot }}
    </button>
@endif
