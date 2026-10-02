<x-layouts.app title="Rekapitulasi Okupansi & Kerusakan">
    <x-slot:header>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#2D4C79]/10 text-[#2D4C79]">
                        Analitik & Pelaporan
                    </span>
                    <span class="text-xs text-[#667085]">·</span>
                    <span class="text-xs text-[#667085]">Modul DA-03 (FR-19)</span>
                    <span class="text-xs text-[#667085]">·</span>
                    <span class="text-xs text-[#667085]">Aturan BR-21 Terverifikasi</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                    Rekapitulasi Okupansi & Kerusakan
                </h1>
                <p class="text-sm text-[#667085] mt-1">
                    Okupansi penggunaan fasilitas dan frekuensi laporan kerusakan per fasilitas serta lokasi kampus.
                </p>
            </div>
            <div class="flex items-center gap-3">
                <a
                    href="{{ route('admin.recap.export', array_merge(request()->query(), ['format' => 'csv'])) }}"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-[#2D4C79] text-white hover:bg-[#243E63] shadow-xs transition"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Ekspor CSV
                </a>
                <a
                    href="{{ route('admin.dashboard') }}"
                    class="inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                >
                    Kembali ke Dashboard
                </a>
            </div>
        </div>
    </x-slot:header>

    <div class="space-y-6">
        {{-- Flash Messages --}}
        @if (session('success'))
            <x-alert type="success" :message="session('success')" />
        @endif
        @if (session('error'))
            <x-alert type="danger" :message="session('error')" />
        @endif

        {{-- Form Filter Kompak --}}
        <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
            <form action="{{ route('admin.recap.index') }}" method="GET" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {{-- Filter Preset Periode --}}
                    <div>
                        <label for="period" class="block text-xs font-semibold text-[#4B5563] mb-1">
                            Periode Waktu
                        </label>
                        <select
                            id="period"
                            name="period"
                            class="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                            onchange="this.form.submit()"
                        >
                            <option value="this_month" {{ $period === 'this_month' ? 'selected' : '' }}>Bulan Ini</option>
                            <option value="last_month" {{ $period === 'last_month' ? 'selected' : '' }}>Bulan Lalu</option>
                            <option value="last_30_days" {{ $period === 'last_30_days' ? 'selected' : '' }}>30 Hari Terakhir</option>
                            <option value="last_90_days" {{ $period === 'last_90_days' ? 'selected' : '' }}>90 Hari Terakhir</option>
                            <option value="all" {{ $period === 'all' ? 'selected' : '' }}>Semua Waktu</option>
                            <option value="custom" {{ $period === 'custom' ? 'selected' : '' }}>Kustom Rentang Tanggal</option>
                        </select>
                    </div>

                    {{-- Tanggal Mulai --}}
                    <div>
                        <label for="start_date" class="block text-xs font-semibold text-[#4B5563] mb-1">
                            Dari Tanggal
                        </label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value="{{ $start_date_input }}"
                            class="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                        />
                    </div>

                    {{-- Tanggal Selesai --}}
                    <div>
                        <label for="end_date" class="block text-xs font-semibold text-[#4B5563] mb-1">
                            Sampai Tanggal
                        </label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value="{{ $end_date_input }}"
                            class="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                        />
                    </div>

                    {{-- Filter Tipe Fasilitas --}}
                    <div>
                        <label for="facility_type" class="block text-xs font-semibold text-[#4B5563] mb-1">
                            Tipe Fasilitas
                        </label>
                        <select
                            id="facility_type"
                            name="facility_type"
                            class="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                        >
                            <option value="">Semua Tipe</option>
                            @foreach ($facility_types as $type)
                                <option value="{{ $type['value'] }}" {{ $facility_type_filter === $type['value'] ? 'selected' : '' }}>
                                    {{ $type['label'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Filter Lokasi --}}
                    <div>
                        <label for="location" class="block text-xs font-semibold text-[#4B5563] mb-1">
                            Lokasi / Gedung
                        </label>
                        <select
                            id="location"
                            name="location"
                            class="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                        >
                            <option value="">Semua Lokasi</option>
                            @foreach ($available_locations as $loc)
                                <option value="{{ $loc }}" {{ $location_filter === $loc ? 'selected' : '' }}>
                                    {{ $loc }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#F3F4F6]">
                    <div class="flex-1 max-w-sm">
                        <input
                            type="text"
                            name="search"
                            value="{{ $search_filter }}"
                            placeholder="Cari nama fasilitas..."
                            class="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                        />
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            type="submit"
                            class="px-4 py-2 text-xs font-semibold rounded-md bg-[#2D4C79] text-white hover:bg-[#243E63] transition"
                        >
                            Terapkan Filter
                        </button>
                        <a
                            href="{{ route('admin.recap.index') }}"
                            class="px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#667085] hover:bg-[#F3F5F7] transition"
                        >
                            Reset
                        </a>
                    </div>
                </div>
            </form>
        </div>

        {{-- 4 Kartu KPI Ringkasan Rekap --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Total Reservasi Disetujui</span>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-[#111827]">{{ $summary['total_reservations'] }}</span>
                    <span class="text-xs text-[#667085]">penggunaan</span>
                </div>
                <div class="mt-2 text-xs text-[#667085]">
                    Periode: {{ $filter_label }}
                </div>
            </div>

            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Total Jam Penggunaan</span>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-[#111827]">{{ $summary['total_hours_used'] }}</span>
                    <span class="text-xs text-[#667085]">jam terpakai</span>
                </div>
                <div class="mt-2 text-xs text-[#667085]">
                    Rata-rata Okupansi: <strong class="text-[#111827]">{{ $summary['avg_occupancy_rate'] }}%</strong>
                </div>
            </div>

            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Laporan Kerusakan Masuk</span>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-rose-700">{{ $summary['total_damage_reports'] }}</span>
                    <span class="text-xs text-[#667085]">laporan</span>
                </div>
                <div class="mt-2 text-xs text-[#667085]">
                    Lokasi Terbanyak: <strong class="text-[#111827]">{{ $summary['most_damaged_location'] }}</strong>
                </div>
            </div>

            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
                <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Fasilitas Paling Sering Dipakai</span>
                <div class="mt-2 truncate font-bold text-lg text-[#111827]" title="{{ $summary['most_used_facility'] }}">
                    {{ $summary['most_used_facility'] }}
                </div>
                <div class="mt-2 text-xs text-[#667085]">
                    Frekuensi: <strong class="text-[#111827]">{{ $summary['most_used_count'] }} kali</strong>
                </div>
            </div>
        </div>

        {{-- Callout Box: Aturan Bisnis BR-21 (Load-bearing Requirement) --}}
        <div class="rounded-lg bg-blue-50/70 border border-blue-200 p-4 text-xs text-[#2D4C79] flex items-start gap-3">
            <svg class="w-5 h-5 text-[#2D4C79] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <strong class="font-semibold block text-sm mb-0.5">Penetapan Aturan Rekapitulasi (BR-21):</strong>
                Reservasi penuh ruangan dihitung secara tepat sebagai penggunaan ruangan tersebut. Alat di dalam ruangan dinonaktifkan dari pemesanan selama reservasi berlangsung, namun <em>tidak menambah frekuensi penggunaan individual alat</em>. Frekuensi penggunaan alat hanya dihitung dari reservasi alat yang diajukan dan disetujui secara eksplisit.
            </div>
        </div>

        {{-- Bagian 1: Tabel Okupansi & Penggunaan Fasilitas --}}
        <div class="bg-white border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden">
            <div class="px-6 py-4 border-b border-[#E5E7EB] bg-[#FBFBFC] flex items-center justify-between">
                <div>
                    <h2 class="text-base font-bold text-[#111827]">
                        Rekapitulasi Okupansi & Penggunaan Fasilitas
                    </h2>
                    <p class="text-xs text-[#667085] mt-0.5">
                        Menampilkan seluruh ruangan dan alat terdaftar beserta jam terbang pemakaian pada periode terpilih
                    </p>
                </div>
                <span class="text-xs font-semibold text-[#667085] bg-white border border-[#D0D5DD] px-2.5 py-1 rounded">
                    {{ count($facilities) }} fasilitas terdata
                </span>
            </div>

            @if (count($facilities) > 0)
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-[#F9FAFB] text-xs font-semibold text-[#4B5563] uppercase border-b border-[#E5E7EB]">
                            <tr>
                                <th class="px-6 py-3">Nama Fasilitas</th>
                                <th class="px-6 py-3">Tipe / Ruangan Induk</th>
                                <th class="px-6 py-3">Lokasi</th>
                                <th class="px-6 py-3">Kondisi</th>
                                <th class="px-6 py-3 text-center">Reservasi Disetujui</th>
                                <th class="px-6 py-3 text-center">Total Durasi</th>
                                <th class="px-6 py-3 text-center">Pengguna Unik</th>
                                <th class="px-6 py-3 text-right">Tingkat Okupansi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E5E7EB]">
                            @foreach ($facilities as $facility)
                                <tr class="hover:bg-[#F9FAFB] transition">
                                    <td class="px-6 py-3.5">
                                        <div class="font-semibold text-[#111827]">
                                            {{ $facility['name'] }}
                                        </div>
                                        <div class="text-[11px] text-[#667085]">
                                            Kapasitas: {{ $facility['capacity'] }} orang
                                        </div>
                                    </td>
                                    <td class="px-6 py-3.5 text-xs text-[#4B5563]">
                                        @if ($facility['is_tool'])
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                                Alat
                                            </span>
                                            @if ($facility['parent_room_name'])
                                                <div class="text-[11px] text-[#667085] mt-0.5">
                                                    Ruangan: {{ $facility['parent_room_name'] }}
                                                </div>
                                            @endif
                                        @else
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                                                {{ $facility['type_label'] }}
                                            </span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-3.5 text-xs text-[#4B5563]">
                                        {{ $facility['location'] }}
                                    </td>
                                    <td class="px-6 py-3.5">
                                        <x-status-badge :status="$facility['condition']" size="sm" />
                                    </td>
                                    <td class="px-6 py-3.5 text-center font-bold text-[#111827]">
                                        {{ $facility['usage_count'] }} kali
                                    </td>
                                    <td class="px-6 py-3.5 text-center text-xs font-medium text-[#4B5563]">
                                        {{ $facility['usage_hours'] }} Jam
                                    </td>
                                    <td class="px-6 py-3.5 text-center text-xs text-[#667085]">
                                        {{ $facility['unique_users_count'] }} orang
                                    </td>
                                    <td class="px-6 py-3.5 text-right font-semibold text-[#2D4C79]">
                                        <div class="inline-flex items-center gap-1.5">
                                            <div class="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    class="h-full bg-[#2D4C79] rounded-full"
                                                    style="width: {{ min(100, $facility['occupancy_rate']) }}%"
                                                ></div>
                                            </div>
                                            <span class="text-xs">{{ $facility['occupancy_rate'] }}%</span>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="px-6 py-12 text-center">
                    <p class="text-sm font-semibold text-[#111827]">Tidak Ada Fasilitas Sesuai Filter</p>
                    <p class="text-xs text-[#667085] mt-1">Coba sesuaikan filter tipe atau kata kunci pencarian Anda.</p>
                </div>
            @endif
        </div>

        {{-- Bagian 2 & 3: Frekuensi Kerusakan per Fasilitas & Lokasi --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {{-- Tabel Kerusakan per Fasilitas (2 Kolom) --}}
            <div class="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden">
                <div class="px-6 py-4 border-b border-[#E5E7EB] bg-[#FBFBFC] flex items-center justify-between">
                    <div>
                        <h2 class="text-base font-bold text-[#111827]">
                            Frekuensi Kerusakan per Fasilitas
                        </h2>
                        <p class="text-xs text-[#667085] mt-0.5">
                            Jumlah insiden gangguan atau kerusakan yang dilaporkan civitas
                        </p>
                    </div>
                </div>

                @if (count($damage_by_facility) > 0)
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-[#F9FAFB] text-xs font-semibold text-[#4B5563] uppercase border-b border-[#E5E7EB]">
                                <tr>
                                    <th class="px-6 py-3">Fasilitas</th>
                                    <th class="px-6 py-3">Lokasi</th>
                                    <th class="px-6 py-3">Kondisi</th>
                                    <th class="px-6 py-3 text-right">Laporan Masuk</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#E5E7EB]">
                                @foreach ($damage_by_facility as $df)
                                    <tr class="hover:bg-[#F9FAFB] transition">
                                        <td class="px-6 py-3.5 font-semibold text-[#111827]">
                                            {{ $df['name'] }}
                                        </td>
                                        <td class="px-6 py-3.5 text-xs text-[#4B5563]">
                                            {{ $df['location'] }}
                                        </td>
                                        <td class="px-6 py-3.5">
                                            <x-status-badge :status="$df['condition']" size="sm" />
                                        </td>
                                        <td class="px-6 py-3.5 text-right font-bold text-rose-700">
                                            {{ $df['report_count'] }} kali
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <div class="px-6 py-10 text-center text-xs text-[#667085]">
                        Tidak ada laporan kerusakan pada periode filter terpilih.
                    </div>
                @endif
            </div>

            {{-- Tabel Kerusakan per Lokasi (1 Kolom) --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg shadow-2xs overflow-hidden">
                <div class="px-6 py-4 border-b border-[#E5E7EB] bg-[#FBFBFC]">
                    <h2 class="text-base font-bold text-[#111827]">
                        Frekuensi per Lokasi
                    </h2>
                    <p class="text-xs text-[#667085] mt-0.5">
                        Titik konsentrasi insiden per gedung
                    </p>
                </div>

                @if (count($damage_by_location) > 0)
                    <div class="divide-y divide-[#E5E7EB]">
                        @foreach ($damage_by_location as $locStat)
                            <div class="px-6 py-3.5 flex items-center justify-between hover:bg-[#F9FAFB] transition">
                                <div>
                                    <div class="text-sm font-semibold text-[#111827]">
                                        {{ $locStat['location'] }}
                                    </div>
                                    <div class="text-xs text-[#667085] mt-0.5">
                                        {{ $locStat['facilities_count'] }} fasilitas terdata
                                    </div>
                                </div>
                                <span class="font-bold text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
                                    {{ $locStat['total_reports'] }} insiden
                                </span>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="px-6 py-10 text-center text-xs text-[#667085]">
                        Belum ada laporan kerusakan di lokasi mana pun pada periode ini.
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-layouts.app>
