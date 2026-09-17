@props([
    'title' => null,
    'subtitle' => null,
    'headerActions' => null,
    'footer' => null,
    'padding' => true,
])

<div {{ $attributes->merge(['class' => 'bg-white rounded-lg border border-[#E5E7EB] shadow-xs overflow-hidden']) }}>
    @if($title || $subtitle || isset($header) || isset($headerActions))
        <div class="px-5 py-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            @if(isset($header))
                {{ $header }}
            @else
                <div>
                    @if($title)
                        <h3 class="text-base font-semibold text-[#111827]">{{ $title }}</h3>
                    @endif
                    @if($subtitle)
                        <p class="text-xs text-[#667085] mt-0.5">{{ $subtitle }}</p>
                    @endif
                </div>
                @if(isset($headerActions))
                    <div class="flex items-center gap-2">
                        {{ $headerActions }}
                    </div>
                @endif
            @endif
        </div>
    @endif

    <div @class(['p-5' => $padding])>
        {{ $slot }}
    </div>

    @if($footer || isset($footerSlot))
        <div class="px-5 py-3.5 bg-[#F7F8FA] border-t border-[#E5E7EB] text-xs text-[#667085]">
            {{ $footer ?? $footerSlot }}
        </div>
    @endif
</div>
