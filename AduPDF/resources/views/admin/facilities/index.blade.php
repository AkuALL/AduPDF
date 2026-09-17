@extends('layouts.admin', ['title' => 'Kelola Fasilitas Kampus'])

@section('content')
<div class="space-y-6">
    <!-- Header Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 class="text-xl font-bold text-slate-800">Kelola Fasilitas Kampus</h1>
            <p class="text-xs text-slate-500 mt-1">
                Kelola data master ruangan, aula, laboratorium, peralatan, dan lapangan.
            </p>
        </div>
        <div>
            <a href="{{ route('admin.facilities.create') }}"
               class="inline-flex items-center text-xs bg-[#2D4C79] hover:bg-[#1e3454] text-white font-semibold px-4 py-2 rounded-md shadow-sm transition">
                + Tambah Fasilitas Baru
            </a>
        </div>
    </div>

    <!-- Status Filter Counts -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <a href="{{ route('admin.facilities.index') }}"
           class="bg-white p-4 rounded-xl border {{ empty($condition) ? 'border-[#2D4C79] ring-1 ring-[#2D4C79]' : 'border-slate-200' }} shadow-sm hover:border-slate-300 transition">
            <span class="text-xs text-slate-500 font-medium">Total Fasilitas</span>
            <div class="text-2xl font-bold text-slate-800 mt-1">{{ $counts['total'] }}</div>
        </a>
        <a href="{{ route('admin.facilities.index', ['condition' => 'aktif']) }}"
           class="bg-white p-4 rounded-xl border {{ $condition === 'aktif' ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-slate-200' }} shadow-sm hover:border-slate-300 transition">
            <span class="text-xs text-emerald-700 font-medium">Aktif</span>
            <div class="text-2xl font-bold text-emerald-700 mt-1">{{ $counts['active'] }}</div>
        </a>
        <a href="{{ route('admin.facilities.index', ['condition' => 'dalam_perbaikan']) }}"
           class="bg-white p-4 rounded-xl border {{ $condition === 'dalam_perbaikan' ? 'border-amber-600 ring-1 ring-amber-600' : 'border-slate-200' }} shadow-sm hover:border-slate-300 transition">
            <span class="text-xs text-amber-700 font-medium">Dalam Perbaikan</span>
            <div class="text-2xl font-bold text-amber-700 mt-1">{{ $counts['under_repair'] }}</div>
        </a>
        <a href="{{ route('admin.facilities.index', ['condition' => 'nonaktif']) }}"
           class="bg-white p-4 rounded-xl border {{ $condition === 'nonaktif' ? 'border-slate-600 ring-1 ring-slate-600' : 'border-slate-200' }} shadow-sm hover:border-slate-300 transition">
            <span class="text-xs text-slate-600 font-medium">Nonaktif</span>
            <div class="text-2xl font-bold text-slate-700 mt-1">{{ $counts['inactive'] }}</div>
        </a>
    </div>

    <!-- Filters and Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Search & Filter Bar -->
        <form method="GET" action="{{ route('admin.facilities.index') }}" class="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-3">
            @if($condition)
                <input type="hidden" name="condition" value="{{ $condition }}">
            @endif
            <div class="flex-1">
                <input type="text"
                       name="search"
                       value="{{ $search }}"
                       placeholder="Cari berdasarkan nama fasilitas atau lokasi..."
                       class="w-full text-xs rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white">
            </div>
            <div class="w-full md:w-48">
                <select name="type" class="w-full text-xs rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white">
                    <option value="">Semua Tipe</option>
                    <option value="ruang_kelas" {{ $type === 'ruang_kelas' ? 'selected' : '' }}>Ruang Kelas</option>
                    <option value="aula" {{ $type === 'aula' ? 'selected' : '' }}>Aula</option>
                    <option value="laboratorium" {{ $type === 'laboratorium' ? 'selected' : '' }}>Laboratorium</option>
                    <option value="alat" {{ $type === 'alat' ? 'selected' : '' }}>Alat</option>
                    <option value="lapangan" {{ $type === 'lapangan' ? 'selected' : '' }}>Lapangan</option>
                </select>
            </div>
            <div class="flex space-x-2">
                <button type="submit" class="text-xs bg-[#2D4C79] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#1e3454] transition shadow-sm">
                    Filter
                </button>
                @if($search || $type || $condition)
                    <a href="{{ route('admin.facilities.index') }}" class="text-xs bg-slate-200 text-slate-700 px-3 py-2 rounded-md font-medium hover:bg-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-700">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                        <th scope="col" class="px-6 py-3">Fasilitas</th>
                        <th scope="col" class="px-6 py-3">Lokasi & Kapasitas</th>
                        <th scope="col" class="px-6 py-3">Relasi Hierarki</th>
                        <th scope="col" class="px-6 py-3">Kondisi</th>
                        <th scope="col" class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    @forelse($facilities as $facility)
                        <tr class="hover:bg-slate-50/75 transition">
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-800">
                                    <a href="{{ route('admin.facilities.show', $facility) }}" class="hover:text-[#2D4C79] hover:underline">
                                        {{ $facility->name }}
                                    </a>
                                </div>
                                <div class="text-xs text-slate-500 mt-0.5">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                        {{ ucfirst(str_replace('_', ' ', $facility->type->value)) }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-xs">
                                <div class="font-medium text-slate-800">{{ $facility->location }}</div>
                                <div class="text-slate-500 mt-0.5">Kapasitas: {{ $facility->capacity }} orang</div>
                            </td>
                            <td class="px-6 py-4 text-xs">
                                @if($facility->isTool())
                                    @if($facility->parentFacility)
                                        <div class="text-slate-600">
                                            Ruangan: <a href="{{ route('admin.facilities.show', $facility->parentFacility) }}" class="text-[#2D4C79] font-medium hover:underline">{{ $facility->parentFacility->name }}</a>
                                        </div>
                                    @else
                                        <span class="text-rose-600 font-semibold">Tidak memiliki ruangan induk</span>
                                    @endif
                                @elseif($facility->isRoom())
                                    <div class="text-slate-600">
                                        <span class="font-semibold text-slate-800">{{ $facility->child_tools_count }}</span> peralatan terdaftar
                                    </div>
                                @else
                                    <span class="text-slate-400">—</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                @if($facility->condition->value === 'aktif')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        ✓ Aktif
                                    </span>
                                @elseif($facility->condition->value === 'dalam_perbaikan')
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                        ! Dalam Perbaikan
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                                        — Nonaktif
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <a href="{{ route('admin.facilities.show', $facility) }}" class="text-xs text-slate-600 hover:text-slate-900 font-medium">
                                    Detail
                                </a>
                                <a href="{{ route('admin.facilities.edit', $facility) }}" class="text-xs text-[#2D4C79] hover:underline font-semibold">
                                    Edit
                                </a>
                                @if($facility->condition->value === 'aktif')
                                    <form action="{{ route('admin.facilities.deactivate', $facility) }}" method="POST" class="inline" onsubmit="return confirm('Apakah Anda yakin ingin menonaktifkan fasilitas ini?');">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit" class="text-xs text-rose-600 hover:text-rose-800 font-medium">
                                            Nonaktifkan
                                        </button>
                                    </form>
                                @elseif($facility->condition->value === 'nonaktif')
                                    <form action="{{ route('admin.facilities.activate', $facility) }}" method="POST" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit" class="text-xs text-emerald-600 hover:text-emerald-800 font-medium">
                                            Aktifkan
                                        </button>
                                    </form>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-slate-500 text-xs">
                                Tidak ada data fasilitas yang sesuai dengan kriteria filter.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($facilities->hasPages())
            <div class="p-4 border-t border-slate-200">
                {{ $facilities->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
