@props([
    'title' => 'Belum ada data',
    'description' => null,
    'actionText' => null,
    'actionUrl' => null,
    'actionMethod' => 'GET',
])

<div {{ $attributes->merge(['class' => 'bg-white rounded-lg border border-[#E5E7EB] p-8 sm:p-12 text-center']) }}>
    <div class="mx-auto w-12 h-12 rounded-full bg-[#F3F5F7] border border-[#E5E7EB] flex items-center justify-center text-[#667085] mb-4">
        @if(isset($icon))
            {{ $icon }}
        @else
            <svg class="w-6 h-6 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        @endif
    </div>

    <h3 class="text-base font-semibold text-[#111827] mb-1">
        {{ $title }}
    </h3>

    @if($description || isset($slot) && trim($slot))
        <p class="text-sm text-[#667085] max-w-md mx-auto mb-6 leading-relaxed">
            {{ $description ?? $slot }}
        </p>
    @endif

    @if($actionText && $actionUrl)
        <div>
            @if(strtoupper($actionMethod) === 'GET')
                <a
                    href="{{ $actionUrl }}"
                    class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#2D4C79] hover:bg-[#243E63] active:bg-[#1C3150] rounded-md transition shadow-xs"
                >
                    {{ $actionText }}
                </a>
            @else
                <form action="{{ $actionUrl }}" method="POST" class="inline">
                    @csrf
                    @if(!in_array(strtoupper($actionMethod), ['POST', 'GET']))
                        @method($actionMethod)
                    @endif
                    <button
                        type="submit"
                        class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#2D4C79] hover:bg-[#243E63] active:bg-[#1C3150] rounded-md transition shadow-xs"
                    >
                        {{ $actionText }}
                    </button>
                </form>
            @endif
        </div>
    @elseif(isset($action))
        <div class="mt-4">
            {{ $action }}
        </div>
    @endif
</div>
