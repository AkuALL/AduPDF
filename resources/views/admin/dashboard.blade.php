<x-layouts.app title="Dashboard Admin">
    <x-slot:header>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        Pusat Kendali & Tata Kelola
                    </span>
                    <span class="text-xs text-[#667085]">·</span>
                    <span class="text-xs text-[#667085]">Role: Administrator</span>
                    <span class="text-xs text-[#667085]">·</span>
                    <span class="text-xs text-[#667085]">{{ $month_label }}</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                    Dashboard Administrasi
                </h1>
                <p class="text-sm text-[#667085] mt-1">
                    Ringkasan eksekutif tata kelola fasilitas, rekapitulasi okupansi pemakaian (BR-21), dan pengawasan akun civitas.
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-2.5">
                <a
                    href="{{ route('admin.recap.index') }}"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#2D4C79] text-white hover:bg-[#243E63] shadow-xs transition"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Rekap & Ekspor
                </a>
                <a
                    href="{{ route('admin.facilities.index') }}"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                >
                    <svg class="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Kelola Fasilitas
                </a>
                <a
                    href="{{ route('admin.users.index') }}"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                >
                    <svg class="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Kelola Akun
                </a>
            </div>
        </div>
    </x-slot:header>

    <div class="space-y-8">
        {{-- Flash Messages --}}
        @if (session('success'))
            <x-alert type="success" :message="session('success')" />
        @endif
        @if (session('error'))
            <x-alert type="danger" :message="session('error')" />
        @endif

        {{-- 4 Kartu KPI Eksekutif --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {{-- Kartu 1: Total Fasilitas --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Infrastruktur Fasilitas</span>
                    <span class="w-8 h-8 rounded-md bg-[#2D4C79]/10 text-[#2D4C79] flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-[#111827]">{{ $facility_stats['total'] }}</span>
                    <span class="text-xs text-[#667085]">total fasilitas</span>
                </div>
                <div class="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                    <span class="text-emerald-700 font-medium">{{ $facility_stats['active'] }} aktif</span>
                    <span>·</span>
                    <span class="text-amber-700 font-medium">{{ $facility_stats['under_repair'] }} perbaikan</span>
                    <span>·</span>
                    <span class="text-rose-700 font-medium">{{ $facility_stats['inactive'] }} nonaktif</span>
                </div>
            </div>

            {{-- Kartu 2: Penggunaan Bulan Berjalan (BR-21) --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Pemakaian ({{ $month_label }})</span>
                    <span class="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-[#111827]">{{ $usage_stats['total_reservations'] }}</span>
                    <span class="text-xs text-[#667085]">reservasi disetujui</span>
                </div>
                <div class="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                    <span>Total Durasi: <strong class="text-[#111827]">{{ $usage_stats['total_hours'] }} Jam</strong></span>
                    <span class="text-[11px] text-[#2D4C79] font-medium" title="BR-21: Reservasi penuh ruangan dihitung untuk ruangan; penggunaan alat hanya dari reservasi alat eksplisit">Aturan BR-21 ✓</span>
                </div>
            </div>

            {{-- Kartu 3: Kerusakan & Perbaikan --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Gangguan & Perbaikan</span>
                    <span class="w-8 h-8 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-[#111827]">{{ $maintenance_stats['under_repair_count'] }}</span>
                    <span class="text-xs text-[#667085]">dalam perbaikan</span>
                </div>
                <div class="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                    <span>Laporan Masuk: <strong class="text-[#111827]">{{ $maintenance_stats['month_reports_count'] }}</strong></span>
                    <a href="{{ route('admin.recap.index') }}" class="text-[#2D4C79] hover:underline font-medium">Detail →</a>
                </div>
            </div>

            {{-- Kartu 4: Tata Kelola Akun --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Tata Kelola Akun</span>
                    <span class="w-8 h-8 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-[#111827]">{{ $account_stats['total_users'] }}</span>
                    <span class="text-xs text-[#667085]">pengguna terdaftar</span>
                </div>
                <div class="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                    <span>{{ $account_stats['pengguna_count'] }} Pengguna</span>
                    <span>·</span>
                    <span>{{ $account_stats['petugas_count'] }} Petugas</span>
                    <span>·</span>
                    <span class="text-amber-800 font-semibold">1 Admin</span>
                </div>
            </div>
        </div>

        {{-- Panel 1: Pantauan Pemeliharaan & Fasilitas Perlu Perhatian --}}
        <div class="bg-white border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden">
            <div class="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FBFBFC]">
                <div class="flex items-center gap-2.5">
                    <div class="w-2.5 h-2.5 rounded-full {{ count($maintenance_stats['under_repair_list']) > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500' }}"></div>
                    <h2 class="text-base font-bold text-[#111827]">
                        Pantauan Pemeliharaan Fasilitas
                    </h2>
                </div>
                <span class="text-xs text-[#667085]">
                    {{ count($maintenance_stats['under_repair_list']) }} fasilitas sedang dalam perbaikan
                </span>
            </div>

            @if (count($maintenance_stats['under_repair_list']) > 0)
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-[#F9FAFB] text-xs font-semibold text-[#4B5563] uppercase border-b border-[#E5E7EB]">
                            <tr>
                                <th class="px-6 py-3">Nama Fasilitas</th>
                                <th class="px-6 py-3">Tipe / Ruangan Induk</th>
                                <th class="px-6 py-3">Lokasi</th>
                                <th class="px-6 py-3">Status Kondisi</th>
                                <th class="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E5E7EB]">
                            @foreach ($maintenance_stats['under_repair_list'] as $item)
                                <tr class="hover:bg-[#F9FAFB] transition">
                                    <td class="px-6 py-3.5 font-semibold text-[#111827]">
                                        {{ $item['name'] }}
                                    </td>
                                    <td class="px-6 py-3.5 text-xs text-[#4B5563]">
                                        @if ($item['is_tool'])
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                                Alat
                                            </span>
                                            @if ($item['parent_room'])
                                                <span class="text-[#667085] ml-1">dalam {{ $item['parent_room'] }}</span>
                                            @endif
                                        @else
                                            <span class="capitalize">{{ str_replace('_', ' ', $item['type']) }}</span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-3.5 text-xs text-[#4B5563]">
                                        {{ $item['location'] }}
                                    </td>
                                    <td class="px-6 py-3.5">
                                        <x-status-badge :status="$item['condition']" size="sm" />
                                    </td>
                                    <td class="px-6 py-3.5 text-right">
                                        <a
                                            href="{{ route('admin.facilities.edit', $item['id']) }}"
                                            class="text-xs font-medium text-[#2D4C79] hover:underline"
                                        >
                                            Kelola Fasilitas →
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="px-6 py-8 text-center">
                    <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 class="text-sm font-semibold text-[#111827]">Semua Fasilitas Beroperasi Normal</h3>
                    <p class="text-xs text-[#667085] mt-1 max-w-md mx-auto">
                        Saat ini tidak ada fasilitas yang berstatus dalam perbaikan. Semua ruangan dan alat siap digunakan untuk operasional kampus.
                    </p>
                </div>
            @endif
        </div>

        {{-- Grid 2 Kolom: Fasilitas Terpopuler & Titik Rawan Kerusakan --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {{-- Panel Kiri: Top Used Facilities (BR-21 compliant) --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden flex flex-col justify-between">
                <div>
                    <div class="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FBFBFC]">
                        <div>
                            <h2 class="text-base font-bold text-[#111827]">
                                Fasilitas Terpopuler (Bulan Ini)
                            </h2>
                            <p class="text-xs text-[#667085] mt-0.5">
                                Dihitung berdasarkan reservasi disetujui sesuai aturan BR-21
                            </p>
                        </div>
                        <a href="{{ route('admin.recap.index') }}" class="text-xs text-[#2D4C79] hover:underline font-semibold">
                            Lihat Semua →
                        </a>
                    </div>

                    @if (count($usage_stats['top_used_facilities']) > 0)
                        <div class="divide-y divide-[#E5E7EB]">
                            @foreach ($usage_stats['top_used_facilities'] as $index => $topFacility)
                                <div class="px-6 py-3.5 flex items-center justify-between hover:bg-[#F9FAFB] transition">
                                    <div class="flex items-center gap-3">
                                        <div class="w-6 h-6 rounded-full bg-[#2D4C79]/10 text-[#2D4C79] text-xs font-bold flex items-center justify-center">
                                            {{ $index + 1 }}
                                        </div>
                                        <div>
                                            <div class="text-sm font-semibold text-[#111827]">
                                                {{ $topFacility['name'] }}
                                            </div>
                                            <div class="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                                                <span>{{ $topFacility['type_label'] }}</span>
                                                @if ($topFacility['is_tool'] && $topFacility['parent_room'])
                                                    <span>(dalam {{ $topFacility['parent_room'] }})</span>
                                                @endif
                                                <span>·</span>
                                                <span>{{ $topFacility['location'] }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm font-bold text-[#111827]">
                                            {{ $topFacility['usage_count'] }} kali
                                        </div>
                                        <div class="text-xs text-[#667085]">
                                            {{ $topFacility['usage_hours'] }} jam terpakai
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="px-6 py-10 text-center text-xs text-[#667085]">
                            Belum ada aktivitas reservasi yang disetujui pada bulan {{ $month_label }}.
                        </div>
                    @endif
                </div>

                <div class="px-6 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-xs text-[#667085] flex items-center justify-between">
                    <span>Aturan BR-21: Penggunaan alat hanya dihitung jika dipesan individual</span>
                    <a href="{{ route('admin.recap.index') }}" class="font-medium text-[#2D4C79] hover:underline">
                        Buka Rekapitulasi Lengkap
                    </a>
                </div>
            </div>

            {{-- Panel Kanan: Titik Rawan Kerusakan Fasilitas & Lokasi --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden flex flex-col justify-between">
                <div>
                    <div class="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FBFBFC]">
                        <div>
                            <h2 class="text-base font-bold text-[#111827]">
                                Laporan Gangguan & Kerusakan
                            </h2>
                            <p class="text-xs text-[#667085] mt-0.5">
                                Fasilitas dan lokasi paling sering dilaporkan civitas
                            </p>
                        </div>
                        <a href="{{ route('admin.recap.index', ['period' => 'this_month']) }}" class="text-xs text-[#2D4C79] hover:underline font-semibold">
                            Rekap Kerusakan →
                        </a>
                    </div>

                    @if (count($maintenance_stats['top_damaged_facilities']) > 0)
                        <div class="p-6 space-y-5">
                            <div>
                                <h3 class="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2.5">
                                    Fasilitas Paling Sering Dilaporkan:
                                </h3>
                                <div class="space-y-2">
                                    @foreach ($maintenance_stats['top_damaged_facilities'] as $damaged)
                                        <div class="flex items-center justify-between text-xs py-1.5 px-3 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                                            <span class="font-medium text-[#111827] truncate pr-2">
                                                {{ $damaged['name'] }}
                                                <span class="text-[#667085] font-normal">({{ $damaged['location'] }})</span>
                                            </span>
                                            <span class="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                {{ $damaged['report_count'] }} laporan
                                            </span>
                                        </div>
                                    @endforeach
                                </div>
                            </div>

                            @if (count($maintenance_stats['top_damaged_locations']) > 0)
                                <div class="pt-3 border-t border-[#F3F4F6]">
                                    <h3 class="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2.5">
                                        Sebaran Lokasi / Gedung Rawan:
                                    </h3>
                                    <div class="grid grid-cols-2 gap-2">
                                        @foreach ($maintenance_stats['top_damaged_locations'] as $loc)
                                            <div class="p-2.5 rounded bg-slate-50 border border-slate-200">
                                                <div class="font-semibold text-xs text-[#111827] truncate">
                                                    {{ $loc['location'] }}
                                                </div>
                                                <div class="text-[11px] text-[#667085] mt-1 flex items-center justify-between">
                                                    <span>{{ $loc['facilities_count'] }} fasilitas</span>
                                                    <span class="font-bold text-rose-600">{{ $loc['total_reports'] }} insiden</span>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endif
                        </div>
                    @else
                        <div class="px-6 py-10 text-center text-xs text-[#667085]">
                            Belum ada laporan kerusakan baru pada bulan {{ $month_label }}.
                        </div>
                    @endif
                </div>

                <div class="px-6 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-xs text-[#667085] flex items-center justify-between">
                    <span>Data dihimpun dari laporan civitas kampus</span>
                    <a href="{{ route('admin.recap.index') }}" class="font-medium text-[#2D4C79] hover:underline">
                        Analitik Lokasi Lengkap
                    </a>
                </div>
            </div>
        </div>

        {{-- Panel 3: Pintasan Cepat Akses Administrasi --}}
        <div class="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-2xs">
            <h2 class="text-base font-bold text-[#111827] mb-1">
                Pintasan Cepat Tata Kelola Kampus
            </h2>
            <p class="text-xs text-[#667085] mb-4">
                Akses instan modul administrasi tanpa tumpang tindih dengan antrean operasional harian Petugas.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <a
                    href="{{ route('admin.recap.index') }}"
                    class="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                >
                    <div class="flex items-center justify-between mb-2">
                        <span class="w-8 h-8 rounded-md bg-[#2D4C79]/10 text-[#2D4C79] flex items-center justify-center group-hover:bg-[#2D4C79] group-hover:text-white transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </span>
                        <span class="text-xs text-[#667085] group-hover:text-[#2D4C79] font-medium">Buka →</span>
                    </div>
                    <div class="text-sm font-bold text-[#111827] group-hover:text-[#2D4C79]">
                        Rekapitulasi Okupansi
                    </div>
                    <p class="text-xs text-[#667085] mt-1">
                        Analisis frekuensi pemakaian, durasi, dan ekspor data CSV.
                    </p>
                </a>

                <a
                    href="{{ route('admin.facilities.create') }}"
                    class="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                >
                    <div class="flex items-center justify-between mb-2">
                        <span class="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </span>
                        <span class="text-xs text-[#667085] group-hover:text-emerald-700 font-medium">Tambah →</span>
                    </div>
                    <div class="text-sm font-bold text-[#111827] group-hover:text-emerald-700">
                        Tambah Fasilitas Baru
                    </div>
                    <p class="text-xs text-[#667085] mt-1">
                        Daftarkan ruangan kelas, aula, laboratorium, atau alat baru.
                    </p>
                </a>

                <a
                    href="{{ route('admin.users.petugas.create') }}"
                    class="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                >
                    <div class="flex items-center justify-between mb-2">
                        <span class="w-8 h-8 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </span>
                        <span class="text-xs text-[#667085] group-hover:text-sky-700 font-medium">Buat →</span>
                    </div>
                    <div class="text-sm font-bold text-[#111827] group-hover:text-sky-700">
                        Buat Akun Petugas
                    </div>
                    <p class="text-xs text-[#667085] mt-1">
                        Provisioning staf operasional untuk memproses antrean reservasi.
                    </p>
                </a>

                <a
                    href="{{ route('admin.password.edit') }}"
                    class="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                >
                    <div class="flex items-center justify-between mb-2">
                        <span class="w-8 h-8 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </span>
                        <span class="text-xs text-[#667085] group-hover:text-amber-700 font-medium">Ubah →</span>
                    </div>
                    <div class="text-sm font-bold text-[#111827] group-hover:text-amber-700">
                        Keamanan & Sandi
                    </div>
                    <p class="text-xs text-[#667085] mt-1">
                        Kelola kredensial akun Administrator tunggal (BR-18).
                    </p>
                </a>
            </div>
        </div>
    </div>
</x-layouts.app>
