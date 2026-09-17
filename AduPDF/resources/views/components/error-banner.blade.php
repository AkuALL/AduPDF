@props([
    'title' => 'Terdapat kesalahan pada isian formulir Anda',
    'showList' => true,
])

@if ($errors->any())
    <div {{ $attributes->merge(['class' => 'mb-6 p-4 rounded-lg bg-[#FDECEC] border border-[#F2B8B5] text-[#B42318] text-sm']) }} role="alert">
        <div class="flex items-start gap-3">
            <svg class="w-5 h-5 shrink-0 text-[#B42318] mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div class="flex-1">
                <h4 class="font-semibold text-sm">{{ $title }}</h4>
                @if($showList)
                    <ul class="mt-2 list-disc list-inside text-xs space-y-1">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>
    </div>
@endif
