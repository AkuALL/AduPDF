<x-layouts.app title="Dashboard Petugas">
    <x-slot:header>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#2D4C79]/10 text-[#2D4C79]">
                        Operasional Kampus
                    </span>
                    <span class="text-xs text-[#667085]">·</span>
                    <span class="text-xs text-[#667085]">Role: Petugas</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                    Dashboard Antrean Petugas
                </h1>
                <p class="text-sm text-[#667085] mt-1">
                    Kelola pengajuan reservasi fasilitas dan tindak lanjuti laporan kerusakan baru dari civitas akademika.
                </p>
            </div>
            <div class="flex items-center gap-3">
                <a
                    href="{{ route('petugas.reservations.index') }}"
                    class="inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                >
                    Semua Reservasi
                </a>
                <a
                    href="{{ route('petugas.reports.index') }}"
                    class="inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                >
                    Semua Laporan
                </a>
            </div>
        </div>
    </x-slot:header>

    <div class="space-y-8">
        {{-- Ringkasan Antrean Operasional (Restrained Metrics) --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {{-- Kartu Metrik Reservasi Menunggu --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs flex items-center justify-between">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Antrean Reservasi</span>
                        <x-status-badge status="menunggu" size="sm" />
                    </div>
                    <div class="mt-2 flex items-baseline gap-2">
                        <span class="text-3xl font-bold text-[#111827]">{{ $pending_reservations_count }}</span>
                        <span class="text-xs text-[#667085]">pengajuan menunggu persetujuan</span>
                    </div>
                </div>
                <div class="w-12 h-12 rounded-lg bg-[#FFF5E6] border border-[#F5D6A6] flex items-center justify-center text-[#A15C00]">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>

            {{-- Kartu Metrik Laporan Baru --}}
            <div class="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs flex items-center justify-between">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider">Antrean Kerusakan</span>
                        <x-status-badge status="baru" size="sm" />
                    </div>
                    <div class="mt-2 flex items-baseline gap-2">
                        <span class="text-3xl font-bold text-[#111827]">{{ $new_reports_count }}</span>
                        <span class="text-xs text-[#667085]">laporan baru perlu diproses</span>
                    </div>
                </div>
                <div class="w-12 h-12 rounded-lg bg-[#FFF5E6] border border-[#F5D6A6] flex items-center justify-center text-[#A15C00]">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            </div>
        </div>

        {{-- SEKSI 1: Antrean Reservasi per Segmen Slot Waktu (FR-09 & BR-25) --}}
        <section aria-labelledby="section-reservations" class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                <div>
                    <h2 id="section-reservations" class="text-lg font-bold text-[#111827] flex items-center gap-2">
                        <span>Antrean Reservasi Menunggu</span>
                        <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#2D4C79]/10 text-[#2D4C79]">
                            {{ $pending_reservations_count }}
                        </span>
                    </h2>
                    <p class="text-xs text-[#667085] mt-0.5">
                        Dikelompokkan berdasarkan slot waktu penggunaan (slot terdekat ditampilkan lebih dahulu). Di dalam setiap slot waktu, pengajuan diurutkan secara FIFO (First In, First Out).
                    </p>
                </div>
            </div>

            @if(empty($reservation_segments) || $pending_reservations_count === 0)
                <x-empty-state
                    title="Tidak Ada Antrean Reservasi"
                    description="Seluruh pengajuan reservasi telah diproses. Tidak ada reservasi yang sedang menunggu keputusan saat ini."
                    action-text="Buka Riwayat Reservasi"
                    :action-url="route('petugas.reservations.index')"
                />
            @else
                <div class="space-y-6">
                    @foreach($reservation_segments as $segment)
                        <div class="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-2xs">
                            {{-- Header Segmen Slot Waktu --}}
                            <div class="bg-[#F8FAFC] border-b border-[#E5E7EB] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-7 h-7 rounded-md bg-[#2D4C79]/10 text-[#2D4C79] flex items-center justify-center">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-[#111827]">
                                            {{ $segment['slot_label'] }}
                                        </div>
                                        <div class="text-xs text-[#667085]">
                                            Rentang Slot: {{ $segment['start_time'] }} – {{ $segment['end_time'] }}
                                        </div>
                                    </div>
                                </div>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E9EEF5] text-[#2D4C79] border border-[#BFD6ED]">
                                    {{ $segment['count'] }} Pengajuan di Slot Ini
                                </span>
                            </div>

                            {{-- Tabel Daftar Reservasi dalam Segmen --}}
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-sm text-[#111827]">
                                    <thead class="bg-[#F7F8FA] text-xs font-semibold text-[#667085] uppercase tracking-wider border-b border-[#E5E7EB]">
                                        <tr>
                                            <th scope="col" class="px-4 py-3">Fasilitas</th>
                                            <th scope="col" class="px-4 py-3">Pemesan</th>
                                            <th scope="col" class="px-4 py-3">Tujuan Penggunaan</th>
                                            <th scope="col" class="px-4 py-3">Diajukan Pada</th>
                                            <th scope="col" class="px-4 py-3">Status</th>
                                            <th scope="col" class="px-4 py-3 text-right">Aksi Keputusan</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-[#E5E7EB]">
                                        @foreach($segment['reservations'] as $res)
                                            <tr class="hover:bg-[#F8FAFC] transition">
                                                <td class="px-4 py-3.5">
                                                    <div class="font-semibold text-[#111827]">{{ $res['facility_name'] }}</div>
                                                    <div class="text-xs text-[#667085] mt-0.5">{{ $res['facility_location'] }}</div>
                                                </td>
                                                <td class="px-4 py-3.5">
                                                    <div class="font-medium text-[#111827]">{{ $res['user_name'] }}</div>
                                                </td>
                                                <td class="px-4 py-3.5 max-w-xs">
                                                    <div class="text-xs text-[#111827] line-clamp-2" title="{{ $res['tujuan'] }}">
                                                        {{ $res['tujuan'] }}
                                                    </div>
                                                </td>
                                                <td class="px-4 py-3.5 whitespace-nowrap">
                                                    <div class="text-xs font-medium text-[#111827]">{{ $res['created_at'] }}</div>
                                                    <div class="text-[11px] text-[#667085]">{{ $res['created_at_human'] }}</div>
                                                </td>
                                                <td class="px-4 py-3.5 whitespace-nowrap">
                                                    <x-status-badge :status="$res['status']" size="sm" />
                                                </td>
                                                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                                                    <div class="inline-flex items-center justify-end gap-2">
                                                        {{-- Form Setujui --}}
                                                        <form method="POST" action="{{ route('petugas.reservations.approve', $res['id']) }}" class="inline">
                                                            @csrf
                                                            @method('PATCH')
                                                            <button
                                                                type="submit"
                                                                class="inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#16794A] hover:bg-[#12633c] focus:outline-none focus:ring-2 focus:ring-[#16794A]/20 transition shadow-2xs"
                                                            >
                                                                ✓ Setujui
                                                            </button>
                                                        </form>

                                                        {{-- Form Tolak --}}
                                                        <form
                                                            method="POST"
                                                            action="{{ route('petugas.reservations.reject', $res['id']) }}"
                                                            class="inline"
                                                            onsubmit="return confirm('Apakah Anda yakin ingin menolak pengajuan reservasi ini?');"
                                                        >
                                                            @csrf
                                                            @method('PATCH')
                                                            <button
                                                                type="submit"
                                                                class="inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold text-[#B42318] bg-[#FDECEC] border border-[#F2B8B5] hover:bg-[#FCD8D8] focus:outline-none focus:ring-2 focus:ring-[#B42318]/20 transition"
                                                            >
                                                                × Tolak
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </section>

        {{-- SEKSI 2: Antrean Laporan Kerusakan Baru (FR-09 & BR-13) --}}
        <section aria-labelledby="section-reports" class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                <div>
                    <h2 id="section-reports" class="text-lg font-bold text-[#111827] flex items-center gap-2">
                        <span>Antrean Laporan Kerusakan Baru</span>
                        <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#2D4C79]/10 text-[#2D4C79]">
                            {{ $new_reports_count }}
                        </span>
                    </h2>
                    <p class="text-xs text-[#667085] mt-0.5">
                        Laporan kerusakan yang baru dilaporkan pengguna dan belum ditindaklanjuti. Petugas dapat memeriksa detail kerusakan, lampiran foto, serta mengubah status laporan atau kondisi fasilitas.
                    </p>
                </div>
            </div>

            @if(empty($reports) || $new_reports_count === 0)
                <x-empty-state
                    title="Tidak Ada Laporan Baru"
                    description="Belum ada laporan kerusakan berstatus baru yang perlu ditangani saat ini."
                    action-text="Buka Riwayat Laporan"
                    :action-url="route('petugas.reports.index')"
                />
            @else
                <div class="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-2xs">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-[#111827]">
                            <thead class="bg-[#F7F8FA] text-xs font-semibold text-[#667085] uppercase tracking-wider border-b border-[#E5E7EB]">
                                <tr>
                                    <th scope="col" class="px-4 py-3">Fasilitas Terkait</th>
                                    <th scope="col" class="px-4 py-3">Pelapor</th>
                                    <th scope="col" class="px-4 py-3">Kategori & Deskripsi</th>
                                    <th scope="col" class="px-4 py-3">Waktu Lapor</th>
                                    <th scope="col" class="px-4 py-3">Status Laporan</th>
                                    <th scope="col" class="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#E5E7EB]">
                                @foreach($reports as $rep)
                                    <tr class="hover:bg-[#F8FAFC] transition">
                                        <td class="px-4 py-3.5">
                                            <div class="font-semibold text-[#111827]">{{ $rep['facility_name'] }}</div>
                                            <div class="flex items-center gap-2 mt-1">
                                                <span class="text-xs text-[#667085]">{{ $rep['facility_location'] }}</span>
                                                <span class="text-[#D0D5DD]">·</span>
                                                <x-status-badge :status="$rep['facility_condition']" size="sm" />
                                            </div>
                                        </td>
                                        <td class="px-4 py-3.5">
                                            <div class="font-medium text-[#111827]">{{ $rep['reporter_name'] }}</div>
                                        </td>
                                        <td class="px-4 py-3.5 max-w-sm">
                                            <div class="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[#F0F2F4] text-[#5D6673] mb-1">
                                                {{ $rep['kategori'] }}
                                            </div>
                                            <div class="text-xs text-[#667085] line-clamp-2" title="{{ $rep['deskripsi'] }}">
                                                {{ $rep['deskripsi'] }}
                                            </div>
                                        </td>
                                        <td class="px-4 py-3.5 whitespace-nowrap">
                                            <div class="text-xs font-medium text-[#111827]">{{ $rep['created_at'] }}</div>
                                            <div class="text-[11px] text-[#667085]">{{ $rep['created_at_human'] }}</div>
                                        </td>
                                        <td class="px-4 py-3.5 whitespace-nowrap">
                                            <x-status-badge :status="$rep['status']" size="sm" />
                                        </td>
                                        <td class="px-4 py-3.5 text-right whitespace-nowrap">
                                            <a
                                                href="{{ route('petugas.reports.show', $rep['id']) }}"
                                                class="inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#2D4C79] hover:bg-[#243E63] focus:outline-none focus:ring-2 focus:ring-[#2D4C79]/20 transition shadow-2xs"
                                            >
                                                Detail & Proses →
                                            </a>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @endif
        </section>
    </div>
</x-layouts.app>
