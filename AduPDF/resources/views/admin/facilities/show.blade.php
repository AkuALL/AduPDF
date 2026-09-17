@extends('layouts.admin', ['title' => $facility->name . ' — Detail Fasilitas'])

@section('content')
<div class="max-w-4xl mx-auto space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center justify-between">
        <a href="{{ route('admin.facilities.index') }}" class="text-xs font-semibold text-[#2D4C79] hover:underline flex items-center gap-1">
            ← Kembali ke Daftar Fasilitas
        </a>
        <div class="flex items-center space-x-2">
            <a href="{{ route('admin.facilities.edit', $facility) }}"
               class="text-xs bg-[#2D4C79] hover:bg-[#1e3454] text-white font-semibold px-3 py-1.5 rounded-md shadow-sm transition">
                Edit Fasilitas
            </a>
            @if($facility->condition->value === 'aktif')
                <form action="{{ route('admin.facilities.deactivate', $facility) }}" method="POST" class="inline" onsubmit="return confirm('Apakah Anda yakin ingin menonaktifkan fasilitas ini?');">
                    @csrf
                    @method('PATCH')
                    <button type="submit" class="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-md shadow-sm transition">
                        Nonaktifkan
                    </button>
                </form>
            @elseif($facility->condition->value === 'nonaktif')
                <form action="{{ route('admin.facilities.activate', $facility) }}" method="POST" class="inline">
                    @csrf
                    @method('PATCH')
                    <button type="submit" class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-md shadow-sm transition">
                        Aktifkan Kembali
                    </button>
                </form>
            @endif
        </div>
    </div>

    <!-- Main Detail Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-[#2D4C79] border border-slate-200">
                    {{ ucfirst(str_replace('_', ' ', $facility->type->value)) }}
                </span>
                <h1 class="text-2xl font-bold text-slate-800 mt-1">{{ $facility->name }}</h1>
            </div>
            <div>
                @if($facility->condition->value === 'aktif')
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Kondisi Aktif
                    </span>
                @elseif($facility->condition->value === 'dalam_perbaikan')
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        ! Dalam Perbaikan
                    </span>
                @else
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                        — Nonaktif
                    </span>
                @endif
            </div>
        </div>

        <!-- Metadata Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-200 text-sm">
            <div>
                <span class="text-xs text-slate-500 font-medium">Lokasi</span>
                <div class="font-bold text-slate-800 mt-1">{{ $facility->location }}</div>
            </div>
            <div>
                <span class="text-xs text-slate-500 font-medium">Kapasitas Maksimal</span>
                <div class="font-bold text-slate-800 mt-1">{{ $facility->capacity }} Orang</div>
            </div>
            <div>
                <span class="text-xs text-slate-500 font-medium">Total Riwayat Reservasi</span>
                <div class="font-bold text-slate-800 mt-1">{{ $facility->reservations_count }} Reservasi</div>
            </div>
        </div>

        <!-- Description -->
        <div class="py-6 border-b border-slate-200">
            <h2 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Fasilitas</h2>
            <p class="text-sm text-slate-600 leading-relaxed">
                {{ $facility->description ?? 'Tidak ada deskripsi tambahan untuk fasilitas ini.' }}
            </p>
        </div>

        <!-- Hierarchy Details -->
        @if($facility->isTool())
            <div class="py-6 border-b border-slate-200">
                <h2 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Ruangan Induk</h2>
                @if($facility->parentFacility)
                    <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div class="font-bold text-slate-800">
                                <a href="{{ route('admin.facilities.show', $facility->parentFacility) }}" class="text-[#2D4C79] hover:underline">
                                    {{ $facility->parentFacility->name }}
                                </a>
                            </div>
                            <div class="text-xs text-slate-500 mt-0.5">
                                {{ ucfirst(str_replace('_', ' ', $facility->parentFacility->type->value)) }} • {{ $facility->parentFacility->location }}
                            </div>
                        </div>
                        <div>
                            @if($facility->parentFacility->condition->value === 'aktif')
                                <span class="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    Ruangan Aktif
                                </span>
                            @else
                                <span class="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                    Ruangan Tidak Aktif
                                </span>
                            @endif
                        </div>
                    </div>
                @else
                    <div class="text-xs text-rose-600 font-semibold">
                        Peringatan: Alat ini belum terikat dengan ruangan induk mana pun.
                    </div>
                @endif
            </div>
        @elseif($facility->isRoom())
            <div class="py-6 border-b border-slate-200">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Peralatan yang Terdaftar di Ruangan Ini ({{ $facility->child_tools_count }})
                    </h2>
                    <a href="{{ route('admin.facilities.create') }}" class="text-xs text-[#2D4C79] hover:underline font-semibold">
                        + Tambah Alat ke Ruangan Ini
                    </a>
                </div>

                @if($facility->childTools->isEmpty())
                    <p class="text-xs text-slate-500 italic">
                        Belum ada peralatan terdaftar di ruangan ini.
                    </p>
                @else
                    <div class="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                        @foreach($facility->childTools as $tool)
                            <div class="p-3 bg-white hover:bg-slate-50 flex items-center justify-between transition">
                                <div>
                                    <a href="{{ route('admin.facilities.show', $tool) }}" class="text-sm font-semibold text-[#2D4C79] hover:underline">
                                        {{ $tool->name }}
                                    </a>
                                </div>
                                <div>
                                    @if($tool->condition->value === 'aktif')
                                        <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                            Aktif
                                        </span>
                                    @elseif($tool->condition->value === 'dalam_perbaikan')
                                        <span class="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                            Perbaikan
                                        </span>
                                    @else
                                        <span class="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full">
                                            Nonaktif
                                        </span>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        @endif

        <!-- Danger Zone / Delete Guard (FR-18) -->
        <div class="pt-6">
            <h2 class="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Hapus Fasilitas</h2>
            <div class="bg-rose-50 border border-rose-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="text-xs text-rose-800">
                    <p class="font-semibold">Aturan Kebijakan (FR-18):</p>
                    <p class="mt-0.5 text-rose-700">
                        Fasilitas yang memiliki riwayat reservasi tidak dapat dihapus permanen untuk menjaga integritas data. Gunakan opsi <strong>Nonaktifkan</strong> jika fasilitas sudah tidak digunakan lagi.
                    </p>
                </div>
                <form action="{{ route('admin.facilities.destroy', $facility) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menghapus fasilitas ini secara permanen? Tindakan ini tidak dapat dibatalkan.');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm transition whitespace-nowrap">
                        Hapus Permanen
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
