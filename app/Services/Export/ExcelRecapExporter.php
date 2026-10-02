<?php

namespace App\Services\Export;

class ExcelRecapExporter
{
    /**
     * Generate Excel XML Spreadsheet (2003) content for the analytical recap (DA-04, FR-19).
     *
     * @param  array<string, mixed>  $recapData
     */
    public function generate(array $recapData): string
    {
        $facilities = $recapData['facilities'] ?? [];
        $damageByFacility = $recapData['damage_by_facility'] ?? [];
        $damageByLocation = $recapData['damage_by_location'] ?? [];
        $summary = $recapData['summary'] ?? [];

        $printDate = now()->setTimezone('Asia/Jakarta')->format('d F Y, H:i').' WIB';
        $filterLabel = (string) ($recapData['filter_label'] ?? 'Semua Periode');

        $startDateStr = '—';
        $endDateStr = '—';
        if (isset($recapData['start_date'], $recapData['end_date'])) {
            $startDate = $recapData['start_date'];
            $endDate = $recapData['end_date'];
            $startDateStr = is_object($startDate) && method_exists($startDate, 'format') ? $startDate->format('d/m/Y') : (string) $startDate;
            $endDateStr = is_object($endDate) && method_exists($endDate, 'format') ? $endDate->format('d/m/Y') : (string) $endDate;
        }

        $xml = [];
        $xml[] = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml[] = '<?mso-application progid="Excel.Sheet"?>';
        $xml[] = '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"';
        $xml[] = ' xmlns:o="urn:schemas-microsoft-com:office:office"';
        $xml[] = ' xmlns:x="urn:schemas-microsoft-com:office:excel"';
        $xml[] = ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"';
        $xml[] = ' xmlns:html="http://www.w3.org/TR/REC-html40">';

        // Styles
        $xml[] = ' <Styles>';
        $xml[] = '  <Style ss:ID="Default" ss:Name="Normal">';
        $xml[] = '   <Alignment ss:Vertical="Center"/>';
        $xml[] = '   <Borders/>';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#111827"/>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="Title">';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="15" ss:Bold="1" ss:Color="#2D4C79"/>';
        $xml[] = '   <Alignment ss:Vertical="Center"/>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="SubTitle">';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#667085"/>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="MetaLabel">';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#2D4C79"/>';
        $xml[] = '   <Alignment ss:Vertical="Center"/>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="MetaValue">';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#111827"/>';
        $xml[] = '   <Alignment ss:Vertical="Center"/>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="RuleBox">';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Italic="1" ss:Color="#2D4C79"/>';
        $xml[] = '   <Interior ss:Color="#E9EEF5" ss:Pattern="Solid"/>';
        $xml[] = '   <Alignment ss:Vertical="Center" ss:WrapText="1"/>';
        $xml[] = '   <Borders>';
        $xml[] = '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFD6ED"/>';
        $xml[] = '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#2D4C79"/>';
        $xml[] = '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFD6ED"/>';
        $xml[] = '    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFD6ED"/>';
        $xml[] = '   </Borders>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="TableHeader">';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>';
        $xml[] = '   <Interior ss:Color="#2D4C79" ss:Pattern="Solid"/>';
        $xml[] = '   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>';
        $xml[] = '   <Borders>';
        $xml[] = '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1C3150"/>';
        $xml[] = '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#243E63"/>';
        $xml[] = '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#243E63"/>';
        $xml[] = '    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1C3150"/>';
        $xml[] = '   </Borders>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="DataCell">';
        $xml[] = '   <Alignment ss:Vertical="Center"/>';
        $xml[] = '   <Borders>';
        $xml[] = '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '   </Borders>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="DataCellCenter">';
        $xml[] = '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>';
        $xml[] = '   <Borders>';
        $xml[] = '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '   </Borders>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="DataCellNumber">';
        $xml[] = '   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>';
        $xml[] = '   <NumberFormat ss:Format="#,##0.0"/>';
        $xml[] = '   <Borders>';
        $xml[] = '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '   </Borders>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="DataCellInteger">';
        $xml[] = '   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>';
        $xml[] = '   <NumberFormat ss:Format="#,##0"/>';
        $xml[] = '   <Borders>';
        $xml[] = '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '   </Borders>';
        $xml[] = '  </Style>';
        $xml[] = '  <Style ss:ID="EmptyCell">';
        $xml[] = '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>';
        $xml[] = '   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#667085"/>';
        $xml[] = '   <Interior ss:Color="#F7F8FA" ss:Pattern="Solid"/>';
        $xml[] = '   <Borders>';
        $xml[] = '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>';
        $xml[] = '   </Borders>';
        $xml[] = '  </Style>';
        $xml[] = ' </Styles>';

        // Worksheet 1: Okupansi Fasilitas
        $xml[] = ' <Worksheet ss:Name="Okupansi Fasilitas">';
        $xml[] = '  <Table ss:DefaultRowHeight="20">';
        $xml[] = '   <Column ss:Width="45"/>';  // ID
        $xml[] = '   <Column ss:Width="180"/>'; // Nama Fasilitas
        $xml[] = '   <Column ss:Width="95"/>';  // Tipe
        $xml[] = '   <Column ss:Width="160"/>'; // Ruang Induk
        $xml[] = '   <Column ss:Width="130"/>'; // Lokasi
        $xml[] = '   <Column ss:Width="70"/>';  // Kapasitas
        $xml[] = '   <Column ss:Width="90"/>';  // Kondisi
        $xml[] = '   <Column ss:Width="90"/>';  // Reservasi
        $xml[] = '   <Column ss:Width="90"/>';  // Durasi (Jam)
        $xml[] = '   <Column ss:Width="85"/>';  // Pengguna
        $xml[] = '   <Column ss:Width="95"/>';  // Okupansi (%)

        // Title Rows
        $xml[] = '   <Row ss:Height="26">';
        $xml[] = '    <Cell ss:MergeAcross="10" ss:StyleID="Title"><Data ss:Type="String">ADUPDF — REKAPITULASI OKUPANSI &amp; PENGGUNAAN FASILITAS</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row ss:Height="18">';
        $xml[] = '    <Cell ss:MergeAcross="10" ss:StyleID="SubTitle"><Data ss:Type="String">Sistem Reservasi &amp; Pelaporan Fasilitas Kampus Terpadu</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row/>';

        // Metadata block
        $xml[] = '   <Row>';
        $xml[] = '    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Periode:</Data></Cell>';
        $xml[] = '    <Cell ss:MergeAcross="2" ss:StyleID="MetaValue"><Data ss:Type="String">'.$this->escapeXml($filterLabel).'</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Rentang:</Data></Cell>';
        $xml[] = '    <Cell ss:MergeAcross="2" ss:StyleID="MetaValue"><Data ss:Type="String">'.$this->escapeXml($startDateStr.' s/d '.$endDateStr).'</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Dicetak:</Data></Cell>';
        $xml[] = '    <Cell ss:MergeAcross="1" ss:StyleID="MetaValue"><Data ss:Type="String">'.$this->escapeXml($printDate).'</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row>';
        $xml[] = '    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Fasilitas:</Data></Cell>';
        $xml[] = '    <Cell ss:MergeAcross="2" ss:StyleID="MetaValue"><Data ss:Type="String">'.count($facilities).' unit</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Total Disetujui:</Data></Cell>';
        $xml[] = '    <Cell ss:MergeAcross="2" ss:StyleID="MetaValue"><Data ss:Type="String">'.((int) ($summary['total_reservations'] ?? 0)).' reservasi</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Total Durasi:</Data></Cell>';
        $xml[] = '    <Cell ss:MergeAcross="1" ss:StyleID="MetaValue"><Data ss:Type="String">'.($summary['total_hours_used'] ?? 0).' Jam</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row/>';

        // BR-21 Note Box
        $xml[] = '   <Row ss:Height="22">';
        $xml[] = '    <Cell ss:MergeAcross="10" ss:StyleID="RuleBox"><Data ss:Type="String">Aturan BR-21: Reservasi penuh ruangan dihitung sebagai penggunaan ruangan. Penggunaan alat hanya dihitung dari reservasi alat secara eksplisit.</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row/>';

        // Table Header
        $xml[] = '   <Row ss:Height="24">';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ID</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nama Fasilitas</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Tipe</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Ruangan Induk</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Lokasi</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Kapasitas</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Kondisi</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Reservasi</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Durasi (Jam)</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Pengguna</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Okupansi (%)</Data></Cell>';
        $xml[] = '   </Row>';

        if (empty($facilities)) {
            $xml[] = '   <Row ss:Height="24">';
            $xml[] = '    <Cell ss:MergeAcross="10" ss:StyleID="EmptyCell"><Data ss:Type="String">Tidak ada data fasilitas yang sesuai dengan filter yang dipilih.</Data></Cell>';
            $xml[] = '   </Row>';
        } else {
            foreach ($facilities as $facility) {
                $xml[] = '   <Row ss:Height="20">';
                $xml[] = '    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="Number">'.(int) ($facility['id'] ?? 0).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCell"><Data ss:Type="String">'.$this->escapeXml((string) ($facility['name'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCell"><Data ss:Type="String">'.$this->escapeXml((string) ($facility['type_label'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCell"><Data ss:Type="String">'.$this->escapeXml((string) ($facility['parent_room_name'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCell"><Data ss:Type="String">'.$this->escapeXml((string) ($facility['location'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">'.(int) ($facility['capacity'] ?? 0).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">'.$this->escapeXml((string) ($facility['condition_label'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">'.(int) ($facility['usage_count'] ?? 0).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellNumber"><Data ss:Type="Number">'.(float) ($facility['usage_hours'] ?? 0.0).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">'.(int) ($facility['unique_users_count'] ?? 0).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellNumber"><Data ss:Type="Number">'.(float) ($facility['occupancy_rate'] ?? 0.0).'</Data></Cell>';
                $xml[] = '   </Row>';
            }
        }

        $xml[] = '  </Table>';
        $xml[] = ' </Worksheet>';

        // Worksheet 2: Kerusakan per Fasilitas
        $xml[] = ' <Worksheet ss:Name="Kerusakan per Fasilitas">';
        $xml[] = '  <Table ss:DefaultRowHeight="20">';
        $xml[] = '   <Column ss:Width="70"/>';  // ID
        $xml[] = '   <Column ss:Width="200"/>'; // Nama Fasilitas
        $xml[] = '   <Column ss:Width="160"/>'; // Lokasi
        $xml[] = '   <Column ss:Width="110"/>'; // Kondisi
        $xml[] = '   <Column ss:Width="120"/>'; // Total Laporan

        $xml[] = '   <Row ss:Height="26">';
        $xml[] = '    <Cell ss:MergeAcross="4" ss:StyleID="Title"><Data ss:Type="String">ADUPDF — FREKUENSI KERUSAKAN PER FASILITAS</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row ss:Height="18">';
        $xml[] = '    <Cell ss:MergeAcross="4" ss:StyleID="SubTitle"><Data ss:Type="String">Periode: '.$this->escapeXml($filterLabel).' ('.$this->escapeXml($startDateStr.' s/d '.$endDateStr).')</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row/>';

        $xml[] = '   <Row ss:Height="24">';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ID Fasilitas</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nama Fasilitas</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Lokasi</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Kondisi</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Jumlah Laporan</Data></Cell>';
        $xml[] = '   </Row>';

        if (empty($damageByFacility)) {
            $xml[] = '   <Row ss:Height="24">';
            $xml[] = '    <Cell ss:MergeAcross="4" ss:StyleID="EmptyCell"><Data ss:Type="String">Tidak ada data laporan kerusakan untuk periode ini.</Data></Cell>';
            $xml[] = '   </Row>';
        } else {
            foreach ($damageByFacility as $damage) {
                $xml[] = '   <Row ss:Height="20">';
                $xml[] = '    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="Number">'.(int) ($damage['id'] ?? 0).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCell"><Data ss:Type="String">'.$this->escapeXml((string) ($damage['name'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCell"><Data ss:Type="String">'.$this->escapeXml((string) ($damage['location'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">'.$this->escapeXml((string) ($damage['condition_label'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">'.(int) ($damage['report_count'] ?? 0).'</Data></Cell>';
                $xml[] = '   </Row>';
            }
        }

        $xml[] = '  </Table>';
        $xml[] = ' </Worksheet>';

        // Worksheet 3: Kerusakan per Lokasi
        $xml[] = ' <Worksheet ss:Name="Kerusakan per Lokasi">';
        $xml[] = '  <Table ss:DefaultRowHeight="20">';
        $xml[] = '   <Column ss:Width="220"/>'; // Lokasi
        $xml[] = '   <Column ss:Width="130"/>'; // Jumlah Fasilitas
        $xml[] = '   <Column ss:Width="130"/>'; // Total Laporan

        $xml[] = '   <Row ss:Height="26">';
        $xml[] = '    <Cell ss:MergeAcross="2" ss:StyleID="Title"><Data ss:Type="String">ADUPDF — FREKUENSI KERUSAKAN PER LOKASI / GEDUNG</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row ss:Height="18">';
        $xml[] = '    <Cell ss:MergeAcross="2" ss:StyleID="SubTitle"><Data ss:Type="String">Periode: '.$this->escapeXml($filterLabel).' ('.$this->escapeXml($startDateStr.' s/d '.$endDateStr).')</Data></Cell>';
        $xml[] = '   </Row>';
        $xml[] = '   <Row/>';

        $xml[] = '   <Row ss:Height="24">';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Lokasi / Gedung</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Jumlah Fasilitas</Data></Cell>';
        $xml[] = '    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Total Laporan Kerusakan</Data></Cell>';
        $xml[] = '   </Row>';

        if (empty($damageByLocation)) {
            $xml[] = '   <Row ss:Height="24">';
            $xml[] = '    <Cell ss:MergeAcross="2" ss:StyleID="EmptyCell"><Data ss:Type="String">Tidak ada data kerusakan lokasi untuk periode ini.</Data></Cell>';
            $xml[] = '   </Row>';
        } else {
            foreach ($damageByLocation as $location) {
                $xml[] = '   <Row ss:Height="20">';
                $xml[] = '    <Cell ss:StyleID="DataCell"><Data ss:Type="String">'.$this->escapeXml((string) ($location['location'] ?? '—')).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">'.(int) ($location['facilities_count'] ?? 0).'</Data></Cell>';
                $xml[] = '    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">'.(int) ($location['total_reports'] ?? 0).'</Data></Cell>';
                $xml[] = '   </Row>';
            }
        }

        $xml[] = '  </Table>';
        $xml[] = ' </Worksheet>';

        $xml[] = '</Workbook>';

        return implode("\n", $xml);
    }

    private function escapeXml(string $text): string
    {
        return htmlspecialchars($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
