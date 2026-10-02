<?php

namespace App\Services\Export;

class CsvRecapExporter
{
    /**
     * Generate CSV content for the analytical recap (DA-04, FR-19).
     *
     * @param  array<string, mixed>  $recapData
     */
    public function generate(array $recapData): string
    {
        $handle = fopen('php://temp', 'r+');
        if ($handle === false) {
            throw new \RuntimeException('Gagal mengalokasikan memori untuk berkas CSV.');
        }

        // UTF-8 BOM for Microsoft Excel compatibility
        fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

        $facilities = $recapData['facilities'] ?? [];
        $damageByFacility = $recapData['damage_by_facility'] ?? [];
        $damageByLocation = $recapData['damage_by_location'] ?? [];
        $summary = $recapData['summary'] ?? [];

        // Section 1: Header metadata
        fputcsv($handle, ['=== REKAPITULASI OKUPANSI & KERUSAKAN FASILITAS (ADUPDF) ===']);
        fputcsv($handle, ['Tanggal Cetak', now()->setTimezone('Asia/Jakarta')->format('d F Y, H:i').' WIB']);
        fputcsv($handle, ['Periode Filter', (string) ($recapData['filter_label'] ?? 'Semua Periode')]);
        if (isset($recapData['start_date'], $recapData['end_date'])) {
            $startDate = $recapData['start_date'];
            $endDate = $recapData['end_date'];
            $startStr = is_object($startDate) && method_exists($startDate, 'format') ? $startDate->format('d/m/Y') : (string) $startDate;
            $endStr = is_object($endDate) && method_exists($endDate, 'format') ? $endDate->format('d/m/Y') : (string) $endDate;
            fputcsv($handle, ['Rentang Waktu', $startStr.' s/d '.$endStr]);
        }
        fputcsv($handle, ['Total Fasilitas Terdata', count($facilities)]);
        fputcsv($handle, ['Total Reservasi Disetujui', (string) ($summary['total_reservations'] ?? 0)]);
        fputcsv($handle, ['Total Jam Penggunaan', ($summary['total_hours_used'] ?? 0).' Jam']);
        fputcsv($handle, ['Total Laporan Kerusakan', (string) ($summary['total_damage_reports'] ?? 0)]);
        fputcsv($handle, []);

        // Section 2: Rule BR-21 Note
        fputcsv($handle, ['=== CATATAN ATURAN BISNIS BR-21 ===']);
        fputcsv($handle, ['Reservasi penuh ruangan dihitung sebagai penggunaan ruangan.']);
        fputcsv($handle, ['Penggunaan individual alat hanya dihitung dari reservasi alat yang dilakukan secara eksplisit.']);
        fputcsv($handle, []);

        // Section 3: Facility Occupancy & Usage Table
        fputcsv($handle, ['--- BAGIAN 1: REKAP OKUPANSI & PENGGUNAAN FASILITAS ---']);
        fputcsv($handle, [
            'ID',
            'Nama Fasilitas',
            'Tipe',
            'Ruangan Induk (Khusus Alat)',
            'Lokasi',
            'Kapasitas',
            'Kondisi Saat Ini',
            'Jumlah Reservasi Disetujui',
            'Total Durasi (Jam)',
            'Pengguna Unik',
            'Estimasi Tingkat Okupansi (%)',
        ]);

        if (empty($facilities)) {
            fputcsv($handle, [
                '—',
                'Tidak ada data fasilitas yang sesuai dengan filter yang dipilih.',
                '—',
                '—',
                '—',
                '—',
                '—',
                '0',
                '0',
                '0',
                '0%',
            ]);
        } else {
            foreach ($facilities as $facility) {
                fputcsv($handle, [
                    $facility['id'] ?? '—',
                    $facility['name'] ?? '—',
                    $facility['type_label'] ?? '—',
                    $facility['parent_room_name'] ?? '—',
                    $facility['location'] ?? '—',
                    $facility['capacity'] ?? 0,
                    $facility['condition_label'] ?? '—',
                    $facility['usage_count'] ?? 0,
                    $facility['usage_hours'] ?? 0,
                    $facility['unique_users_count'] ?? 0,
                    ($facility['occupancy_rate'] ?? 0).'%',
                ]);
            }
        }
        fputcsv($handle, []);

        // Section 4: Damage Frequency per Facility
        fputcsv($handle, ['--- BAGIAN 2: FREKUENSI KERUSAKAN PER FASILITAS ---']);
        fputcsv($handle, [
            'ID Fasilitas',
            'Nama Fasilitas',
            'Lokasi',
            'Kondisi',
            'Jumlah Laporan Kerusakan',
        ]);

        if (empty($damageByFacility)) {
            fputcsv($handle, [
                '—',
                'Tidak ada data laporan kerusakan untuk periode ini.',
                '—',
                '—',
                '0',
            ]);
        } else {
            foreach ($damageByFacility as $damage) {
                fputcsv($handle, [
                    $damage['id'] ?? '—',
                    $damage['name'] ?? '—',
                    $damage['location'] ?? '—',
                    $damage['condition_label'] ?? '—',
                    $damage['report_count'] ?? 0,
                ]);
            }
        }
        fputcsv($handle, []);

        // Section 5: Damage Frequency per Location
        fputcsv($handle, ['--- BAGIAN 3: FREKUENSI KERUSAKAN PER LOKASI ---']);
        fputcsv($handle, [
            'Lokasi / Gedung',
            'Jumlah Fasilitas',
            'Total Laporan Kerusakan',
        ]);

        if (empty($damageByLocation)) {
            fputcsv($handle, [
                'Tidak ada data kerusakan lokasi untuk periode ini.',
                '0',
                '0',
            ]);
        } else {
            foreach ($damageByLocation as $location) {
                fputcsv($handle, [
                    $location['location'] ?? '—',
                    $location['facilities_count'] ?? 0,
                    $location['total_reports'] ?? 0,
                ]);
            }
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        if ($content === false) {
            throw new \RuntimeException('Gagal membaca hasil pembuatan berkas CSV.');
        }

        return $content;
    }
}
