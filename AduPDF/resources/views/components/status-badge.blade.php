@props([
    'status' => '',
    'label' => null,
    'context' => null, // 'reservation', 'facility', 'report', 'verification', 'role', or auto
    'size' => 'md', // 'sm', 'md'
])

@php
    $normalized = strtolower(trim((string)$status));

    // Determine config based on status and optional context
    $config = match($normalized) {
        // Reservasi & Verifikasi: Menunggu / Pending
        'menunggu', 'pending' => [
            'label' => $label ?? ($normalized === 'pending' ? 'Menunggu Verifikasi' : 'Menunggu'),
            'icon' => '○',
            'wrapper' => 'bg-[#FFF5E6] text-[#A15C00] border-[#F5D6A6]',
        ],

        // Reservasi / Verifikasi: Disetujui / Approved
        'disetujui', 'approved' => [
            'label' => $label ?? ($normalized === 'approved' ? 'Disetujui' : 'Disetujui'),
            'icon' => '✓',
            'wrapper' => 'bg-[#EAF7F0] text-[#16794A] border-[#B7E2CB]',
        ],

        // Fasilitas: Aktif
        'aktif', 'active' => [
            'label' => $label ?? 'Aktif',
            'icon' => '✓',
            'wrapper' => 'bg-[#EAF7F0] text-[#16794A] border-[#B7E2CB]',
        ],

        // Laporan: Selesai
        'selesai', 'completed' => [
            'label' => $label ?? 'Selesai',
            'icon' => '✓',
            'wrapper' => 'bg-[#EAF7F0] text-[#16794A] border-[#B7E2CB]',
        ],

        // Laporan: Baru
        'baru', 'new' => [
            'label' => $label ?? 'Baru',
            'icon' => '○',
            'wrapper' => 'bg-[#FFF5E6] text-[#A15C00] border-[#F5D6A6]',
        ],

        // Laporan: Diproses
        'diproses', 'in_progress', 'proses' => [
            'label' => $label ?? 'Diproses',
            'icon' => '↻',
            'wrapper' => 'bg-[#EBF3FB] text-[#2463A7] border-[#BFD6ED]',
        ],

        // Fasilitas: Dalam Perbaikan (Repair)
        'dalam_perbaikan', 'perbaikan', 'under_repair' => [
            'label' => $label ?? 'Dalam perbaikan',
            'icon' => '!',
            'wrapper' => 'bg-[#FFF0E8] text-[#B54708] border-[#F5C6A7]',
        ],

        // Ditolak (Reservasi / Laporan / Verifikasi)
        'ditolak', 'rejected' => [
            'label' => $label ?? 'Ditolak',
            'icon' => '×',
            'wrapper' => 'bg-[#FDECEC] text-[#B42318] border-[#F2B8B5]',
        ],

        // Dibatalkan (Reservasi) / Nonaktif (Fasilitas)
        'dibatalkan', 'cancelled', 'canceled' => [
            'label' => $label ?? 'Dibatalkan',
            'icon' => '—',
            'wrapper' => 'bg-[#F0F2F4] text-[#5D6673] border-[#D7DBE0]',
        ],
        'nonaktif', 'inactive' => [
            'label' => $label ?? 'Nonaktif',
            'icon' => '—',
            'wrapper' => 'bg-[#F0F2F4] text-[#5D6673] border-[#D7DBE0]',
        ],

        // Roles
        'admin' => [
            'label' => $label ?? 'Admin',
            'icon' => '★',
            'wrapper' => 'bg-[#E9EEF5] text-[#2D4C79] border-[#BFD6ED]',
        ],
        'petugas' => [
            'label' => $label ?? 'Petugas',
            'icon' => '◆',
            'wrapper' => 'bg-[#EBF3FB] text-[#2463A7] border-[#BFD6ED]',
        ],
        'pengguna', 'user' => [
            'label' => $label ?? 'Pengguna',
            'icon' => '●',
            'wrapper' => 'bg-[#F0F2F4] text-[#5D6673] border-[#D7DBE0]',
        ],

        default => [
            'label' => $label ?? ucfirst($status),
            'icon' => '•',
            'wrapper' => 'bg-[#F0F2F4] text-[#5D6673] border-[#D7DBE0]',
        ],
    };

    $sizeClasses = match($size) {
        'sm' => 'px-2 py-0.5 text-[11px] gap-1',
        default => 'px-2.5 py-1 text-xs gap-1.5',
    };
@endphp

<span {{ $attributes->merge(['class' => 'inline-flex items-center font-semibold rounded-full border ' . $sizeClasses . ' ' . $config['wrapper']]) }} data-status="{{ $normalized }}">
    <span class="font-bold select-none text-[0.9em]" aria-hidden="true">{{ $config['icon'] }}</span>
    <span>{{ $config['label'] }}</span>
</span>
