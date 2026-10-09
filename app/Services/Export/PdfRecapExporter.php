<?php

namespace App\Services\Export;

class PdfRecapExporter
{
    private float $pageWidth = 841.89; // A4 Landscape width in pt

    private float $pageHeight = 595.28; // A4 Landscape height in pt

    private float $marginLeft = 36.0;

    private float $marginRight = 36.0;

    private float $marginTop = 36.0;

    private float $marginBottom = 40.0;

    /** @var array<int, string> */
    private array $pages = [];

    private string $currentStream = '';

    private float $currentY = 0.0;

    private int $currentPageNumber = 0;

    /**
     * Generate PDF content for analytical recap (DA-04, FR-19).
     *
     * @param  array<string, mixed>  $recapData
     */
    public function generate(array $recapData): string
    {
        $this->pages = [];
        $this->currentStream = '';
        $this->currentPageNumber = 0;

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

        // --- PAGE 1: Start ---
        $this->startNewPage();

        // 1. Header Banner & Title
        $this->drawHeaderBanner($filterLabel, $startDateStr, $endDateStr, $printDate);

        // 2. Summary KPI Cards
        $this->drawSummaryCards($summary, count($facilities));

        // 3. BR-21 Note Box
        $this->drawBr21Box();

        // 4. Section 1: Okupansi & Penggunaan Fasilitas Table
        $this->drawSectionTitle('1. Rekapitulasi Okupansi & Penggunaan Fasilitas');

        $facilityColumns = [
            ['title' => 'ID', 'width' => 30, 'align' => 'C'],
            ['title' => 'Nama Fasilitas', 'width' => 140, 'align' => 'L'],
            ['title' => 'Tipe', 'width' => 75, 'align' => 'L'],
            ['title' => 'Ruang Induk', 'width' => 110, 'align' => 'L'],
            ['title' => 'Lokasi', 'width' => 105, 'align' => 'L'],
            ['title' => 'Kps', 'width' => 35, 'align' => 'C'],
            ['title' => 'Kondisi', 'width' => 70, 'align' => 'C'],
            ['title' => 'Resv', 'width' => 45, 'align' => 'R'],
            ['title' => 'Durasi (Jam)', 'width' => 70, 'align' => 'R'],
            ['title' => 'Okupansi', 'width' => 89, 'align' => 'R'],
        ];

        $this->drawTableHeader($facilityColumns);

        if (empty($facilities)) {
            $this->drawEmptyRow('Tidak ada data fasilitas yang sesuai dengan filter yang dipilih.', $facilityColumns);
        } else {
            foreach ($facilities as $facility) {
                // Check if page break is needed
                if ($this->currentY < $this->marginBottom + 30) {
                    $this->startNewPage();
                    $this->drawRunningHeader('Rekapitulasi Okupansi & Penggunaan Fasilitas (Lanjutan)');
                    $this->drawTableHeader($facilityColumns);
                }

                $rowData = [
                    (string) ($facility['id'] ?? '—'),
                    (string) ($facility['name'] ?? '—'),
                    (string) ($facility['type_label'] ?? '—'),
                    (string) ($facility['parent_room_name'] ?? '—'),
                    (string) ($facility['location'] ?? '—'),
                    (string) ($facility['capacity'] ?? '0'),
                    (string) ($facility['condition_label'] ?? '—'),
                    (string) ($facility['usage_count'] ?? '0'),
                    number_format((float) ($facility['usage_hours'] ?? 0), 1).' Jam',
                    number_format((float) ($facility['occupancy_rate'] ?? 0), 1).'%',
                ];

                $this->drawTableRow($rowData, $facilityColumns);
            }
        }

        $this->currentY -= 15;

        // 5. Section 2 & 3: Damage Statistics
        if ($this->currentY < $this->marginBottom + 120) {
            $this->startNewPage();
            $this->drawRunningHeader('Statistik Kerusakan Fasilitas & Lokasi Kampus');
        }

        $this->drawSectionTitle('2. Frekuensi Kerusakan per Fasilitas');

        $damageFacCols = [
            ['title' => 'ID', 'width' => 45, 'align' => 'C'],
            ['title' => 'Nama Fasilitas', 'width' => 240, 'align' => 'L'],
            ['title' => 'Lokasi', 'width' => 200, 'align' => 'L'],
            ['title' => 'Kondisi', 'width' => 130, 'align' => 'C'],
            ['title' => 'Total Laporan', 'width' => 154, 'align' => 'R'],
        ];

        $this->drawTableHeader($damageFacCols);

        if (empty($damageByFacility)) {
            $this->drawEmptyRow('Tidak ada data laporan kerusakan untuk periode ini.', $damageFacCols);
        } else {
            foreach ($damageByFacility as $item) {
                if ($this->currentY < $this->marginBottom + 30) {
                    $this->startNewPage();
                    $this->drawRunningHeader('Statistik Kerusakan per Fasilitas (Lanjutan)');
                    $this->drawTableHeader($damageFacCols);
                }

                $this->drawTableRow([
                    (string) ($item['id'] ?? '—'),
                    (string) ($item['name'] ?? '—'),
                    (string) ($item['location'] ?? '—'),
                    (string) ($item['condition_label'] ?? '—'),
                    (string) ($item['report_count'] ?? '0'),
                ], $damageFacCols);
            }
        }

        $this->currentY -= 14;

        if ($this->currentY < $this->marginBottom + 80) {
            $this->startNewPage();
            $this->drawRunningHeader('Statistik Kerusakan per Lokasi Kampus');
        }

        $this->drawSectionTitle('3. Frekuensi Kerusakan per Lokasi / Gedung');

        $damageLocCols = [
            ['title' => 'Lokasi / Gedung', 'width' => 380, 'align' => 'L'],
            ['title' => 'Jumlah Fasilitas', 'width' => 190, 'align' => 'C'],
            ['title' => 'Total Laporan Kerusakan', 'width' => 199, 'align' => 'R'],
        ];

        $this->drawTableHeader($damageLocCols);

        if (empty($damageByLocation)) {
            $this->drawEmptyRow('Tidak ada data kerusakan lokasi untuk periode ini.', $damageLocCols);
        } else {
            foreach ($damageByLocation as $locItem) {
                if ($this->currentY < $this->marginBottom + 30) {
                    $this->startNewPage();
                    $this->drawRunningHeader('Statistik Kerusakan per Lokasi (Lanjutan)');
                    $this->drawTableHeader($damageLocCols);
                }

                $this->drawTableRow([
                    (string) ($locItem['location'] ?? '—'),
                    (string) ($locItem['facilities_count'] ?? '0'),
                    (string) ($locItem['total_reports'] ?? '0'),
                ], $damageLocCols);
            }
        }

        // Finish last page
        $this->finishCurrentPage();

        return $this->compilePdf($printDate);
    }

    private function startNewPage(): void
    {
        if ($this->currentPageNumber > 0) {
            $this->finishCurrentPage();
        }

        $this->currentPageNumber++;
        $this->currentStream = '';
        $this->currentY = $this->pageHeight - $this->marginTop;
    }

    private function finishCurrentPage(): void
    {
        $this->pages[] = $this->currentStream;
        $this->currentStream = '';
    }

    private function drawHeaderBanner(string $filterLabel, string $startDateStr, string $endDateStr, string $printDate): void
    {
        // Dark navy top bar accent
        $this->fillRect($this->marginLeft, $this->currentY - 3, $this->pageWidth - ($this->marginLeft + $this->marginRight), 3, [0.176, 0.298, 0.475]);
        $this->currentY -= 15;

        // Title and Subtitle
        $this->drawText($this->marginLeft, $this->currentY, 'ADUPDF — SISTEM RESERVASI & PELAPORAN FASILITAS KAMPUS', 9, true, [0.4, 0.44, 0.52]);
        $this->currentY -= 15;

        $this->drawText($this->marginLeft, $this->currentY, 'Rekapitulasi Okupansi & Frekuensi Kerusakan Fasilitas', 16, true, [0.11, 0.19, 0.31]);
        $this->currentY -= 14;

        $filterText = sprintf('Periode: %s (%s s/d %s) · Dicetak: %s', $filterLabel, $startDateStr, $endDateStr, $printDate);
        $this->drawText($this->marginLeft, $this->currentY, $filterText, 9, false, [0.4, 0.44, 0.52]);
        $this->currentY -= 16;
    }

    private function drawRunningHeader(string $title): void
    {
        $this->fillRect($this->marginLeft, $this->currentY - 2, $this->pageWidth - ($this->marginLeft + $this->marginRight), 2, [0.176, 0.298, 0.475]);
        $this->currentY -= 12;
        $this->drawText($this->marginLeft, $this->currentY, 'ADUPDF · '.$title, 10, true, [0.176, 0.298, 0.475]);
        $this->currentY -= 16;
    }

    /**
     * @param  array<string, mixed>  $summary
     */
    private function drawSummaryCards(array $summary, int $facilityCount): void
    {
        $boxWidth = 180.0;
        $boxHeight = 36.0;
        $gap = 16.0;
        $y = $this->currentY - $boxHeight;

        $cards = [
            ['label' => 'Total Fasilitas Terdata', 'val' => $facilityCount.' unit'],
            ['label' => 'Reservasi Disetujui', 'val' => ((int) ($summary['total_reservations'] ?? 0)).' reservasi'],
            ['label' => 'Total Jam Penggunaan', 'val' => ($summary['total_hours_used'] ?? 0).' Jam'],
            ['label' => 'Total Laporan Kerusakan', 'val' => ((int) ($summary['total_damage_reports'] ?? 0)).' laporan'],
        ];

        for ($i = 0; $i < count($cards); $i++) {
            $x = $this->marginLeft + ($i * ($boxWidth + $gap));
            // Card background & border
            $this->fillRect($x, $y, $boxWidth, $boxHeight, [0.97, 0.975, 0.98]);
            $this->drawRect($x, $y, $boxWidth, $boxHeight, [0.85, 0.88, 0.92]);

            // Label & Value
            $this->drawText($x + 8, $y + 22, $cards[$i]['label'], 7.5, false, [0.4, 0.44, 0.52]);
            $this->drawText($x + 8, $y + 8, $cards[$i]['val'], 11, true, [0.176, 0.298, 0.475]);
        }

        $this->currentY = $y - 12;
    }

    private function drawBr21Box(): void
    {
        $width = $this->pageWidth - ($this->marginLeft + $this->marginRight);
        $height = 20.0;
        $y = $this->currentY - $height;

        $this->fillRect($this->marginLeft, $y, $width, $height, [0.914, 0.933, 0.961]);
        $this->fillRect($this->marginLeft, $y, 3, $height, [0.176, 0.298, 0.475]); // Left indicator bar
        $this->drawRect($this->marginLeft, $y, $width, $height, [0.75, 0.84, 0.93]);

        $note = 'Aturan BR-21: Reservasi penuh ruangan dihitung sebagai penggunaan ruangan. Penggunaan alat hanya dihitung dari reservasi alat secara eksplisit.';
        $this->drawText($this->marginLeft + 8, $y + 6, $note, 8, true, [0.14, 0.26, 0.43]);

        $this->currentY = $y - 14;
    }

    private function drawSectionTitle(string $title): void
    {
        $this->drawText($this->marginLeft, $this->currentY, $title, 11, true, [0.11, 0.19, 0.31]);
        $this->currentY -= 14;
    }

    /**
     * @param  array<int, array{title: string, width: float, align: string}>  $columns
     */
    private function drawTableHeader(array $columns): void
    {
        $this->drawTableHeaderAt($this->marginLeft, $this->currentY, $columns);
        $this->currentY -= 18;
    }

    /**
     * @param  array<int, array{title: string, width: float, align: string}>  $columns
     */
    private function drawTableHeaderAt(float $x, float $y, array $columns): void
    {
        $height = 18.0;
        $curX = $x;
        $totalWidth = 0.0;
        foreach ($columns as $col) {
            $totalWidth += $col['width'];
        }

        // Header background (#2D4C79)
        $this->fillRect($x, $y - $height, $totalWidth, $height, [0.176, 0.298, 0.475]);

        foreach ($columns as $col) {
            $textX = $curX + 4;
            if ($col['align'] === 'C') {
                $textX = $curX + ($col['width'] / 2) - (strlen($col['title']) * 2.2);
            } elseif ($col['align'] === 'R') {
                $textX = $curX + $col['width'] - 6 - (strlen($col['title']) * 4.5);
            }

            $this->drawText(max($curX + 2, $textX), $y - $height + 5, $col['title'], 8, true, [1.0, 1.0, 1.0]);
            $curX += $col['width'];
        }
    }

    /**
     * @param  array<int, string>  $rowData
     * @param  array<int, array{title: string, width: float, align: string}>  $columns
     */
    private function drawTableRow(array $rowData, array $columns): void
    {
        $this->drawTableRowAt($this->marginLeft, $this->currentY, $rowData, $columns);
        $this->currentY -= 16;
    }

    /**
     * @param  array<int, string>  $rowData
     * @param  array<int, array{title: string, width: float, align: string}>  $columns
     */
    private function drawTableRowAt(float $x, float $y, array $rowData, array $columns): void
    {
        $height = 16.0;
        $totalWidth = 0.0;
        foreach ($columns as $col) {
            $totalWidth += $col['width'];
        }

        // Border bottom
        $this->drawLine($x, $y - $height, $x + $totalWidth, $y - $height, [0.90, 0.91, 0.93]);

        $curX = $x;
        for ($i = 0; $i < count($columns); $i++) {
            $col = $columns[$i];
            $val = $rowData[$i] ?? '—';
            $val = $this->truncateText($val, (int) ($col['width'] / 4.8));

            $textX = $curX + 4;
            if ($col['align'] === 'C') {
                $textX = $curX + ($col['width'] / 2) - (strlen($val) * 2.1);
            } elseif ($col['align'] === 'R') {
                $textX = $curX + $col['width'] - 6 - (strlen($val) * 4.2);
            }

            $this->drawText(max($curX + 2, $textX), $y - $height + 4, $val, 7.5, false, [0.15, 0.18, 0.23]);
            $curX += $col['width'];
        }
    }

    /**
     * @param  array<int, array{title: string, width: float, align: string}>  $columns
     */
    private function drawEmptyRow(string $message, array $columns): void
    {
        $this->drawEmptyRowAt($this->marginLeft, $this->currentY, $message, $columns);
        $this->currentY -= 20;
    }

    /**
     * @param  array<int, array{title: string, width: float, align: string}>  $columns
     */
    private function drawEmptyRowAt(float $x, float $y, string $message, array $columns): void
    {
        $height = 20.0;
        $totalWidth = 0.0;
        foreach ($columns as $col) {
            $totalWidth += $col['width'];
        }

        $this->fillRect($x, $y - $height, $totalWidth, $height, [0.98, 0.98, 0.99]);
        $this->drawRect($x, $y - $height, $totalWidth, $height, [0.90, 0.91, 0.93]);
        $this->drawText($x + ($totalWidth / 2) - (strlen($message) * 2.3), $y - $height + 6, $message, 8, false, [0.5, 0.55, 0.62]);
    }

    /**
     * @param  array{0: float, 1: float, 2: float}  $color
     */
    private function drawText(float $x, float $y, string $text, float $size = 9, bool $bold = false, array $color = [0, 0, 0]): void
    {
        $fontName = $bold ? '/F1' : '/F2';
        $escaped = $this->escapePdfString($text);

        $r = sprintf('%.3f', $color[0]);
        $g = sprintf('%.3f', $color[1]);
        $b = sprintf('%.3f', $color[2]);

        $this->currentStream .= sprintf(
            "BT %s %s %s rg %s %.1f Tf 1 0 0 1 %.2f %.2f Tm (%s) Tj ET\n",
            $r, $g, $b, $fontName, $size, $x, $y, $escaped
        );
    }

    /**
     * @param  array{0: float, 1: float, 2: float}  $color
     */
    private function fillRect(float $x, float $y, float $w, float $h, array $color): void
    {
        $r = sprintf('%.3f', $color[0]);
        $g = sprintf('%.3f', $color[1]);
        $b = sprintf('%.3f', $color[2]);

        $this->currentStream .= sprintf("%.3f %.3f %.3f rg %.2f %.2f %.2f %.2f re f\n", $r, $g, $b, $x, $y, $w, $h);
    }

    /**
     * @param  array{0: float, 1: float, 2: float}  $color
     */
    private function drawRect(float $x, float $y, float $w, float $h, array $color): void
    {
        $r = sprintf('%.3f', $color[0]);
        $g = sprintf('%.3f', $color[1]);
        $b = sprintf('%.3f', $color[2]);

        $this->currentStream .= sprintf("%.3f %.3f %.3f RG 0.5 w %.2f %.2f %.2f %.2f re S\n", $r, $g, $b, $x, $y, $w, $h);
    }

    /**
     * @param  array{0: float, 1: float, 2: float}  $color
     */
    private function drawLine(float $x1, float $y1, float $x2, float $y2, array $color): void
    {
        $r = sprintf('%.3f', $color[0]);
        $g = sprintf('%.3f', $color[1]);
        $b = sprintf('%.3f', $color[2]);

        $this->currentStream .= sprintf("%.3f %.3f %.3f RG 0.5 w %.2f %.2f m %.2f %.2f l S\n", $r, $g, $b, $x1, $y1, $x2, $y2);
    }

    private function truncateText(string $text, int $maxChars): string
    {
        if (mb_strlen($text) <= $maxChars) {
            return $text;
        }

        return mb_substr($text, 0, max(1, $maxChars - 2)).'..';
    }

    private function escapePdfString(string $text): string
    {
        // Transliterate UTF-8 characters to Windows-1252 / ISO-8859-1 for PDF standard fonts
        $sanitized = @iconv('UTF-8', 'windows-1252//TRANSLIT//IGNORE', $text);
        if ($sanitized === false) {
            $sanitized = utf8_decode($text);
        }

        $escaped = '';
        $len = strlen($sanitized);
        for ($i = 0; $i < $len; $i++) {
            $c = $sanitized[$i];
            if ($c === '\\' || $c === '(' || $c === ')') {
                $escaped .= '\\'.$c;
            } elseif (ord($c) < 32 || ord($c) > 126) {
                $escaped .= sprintf('\\%03o', ord($c));
            } else {
                $escaped .= $c;
            }
        }

        return $escaped;
    }

    private function compilePdf(string $printDate): string
    {
        $totalPages = count($this->pages);
        if ($totalPages === 0) {
            $this->startNewPage();
            $this->finishCurrentPage();
            $totalPages = 1;
        }

        // Append footers to each page stream
        for ($p = 0; $p < $totalPages; $p++) {
            $footerY = $this->marginBottom - 16;
            $footerLine = sprintf('Dokumen Resmi AduPDF (DA-04 / FR-19) — Halaman %d dari %d', $p + 1, $totalPages);
            $timestampLine = sprintf('Dicetak pada %s', $printDate);

            // Footer separator line
            $line = sprintf("0.85 0.88 0.92 RG 0.5 w %.2f %.2f m %.2f %.2f l S\n", $this->marginLeft, $footerY + 12, $this->pageWidth - $this->marginRight, $footerY + 12);
            $txt1 = sprintf("BT 0.5 0.55 0.62 rg /F2 7.5 Tf 1 0 0 1 %.2f %.2f Tm (%s) Tj ET\n", $this->marginLeft, $footerY, $this->escapePdfString($footerLine));
            $txt2 = sprintf("BT 0.5 0.55 0.62 rg /F2 7.5 Tf 1 0 0 1 %.2f %.2f Tm (%s) Tj ET\n", $this->pageWidth - $this->marginRight - 160, $footerY, $this->escapePdfString($timestampLine));

            $this->pages[$p] .= $line.$txt1.$txt2;
        }

        // PDF Document Structure (PDF-1.4)
        $objects = [];
        $objIndex = 1;

        $catalogId = $objIndex++;
        $pagesId = $objIndex++;
        $fontBoldId = $objIndex++;
        $fontRegularId = $objIndex++;

        $pageObjIds = [];
        $contentObjIds = [];

        for ($p = 0; $p < $totalPages; $p++) {
            $pageObjIds[] = $objIndex++;
            $contentObjIds[] = $objIndex++;
        }

        $objects[$catalogId] = sprintf("<< /Type /Catalog /Pages %d 0 R >>\n", $pagesId);

        $kidsStr = implode(' ', array_map(fn ($id) => sprintf('%d 0 R', $id), $pageObjIds));
        $objects[$pagesId] = sprintf("<< /Type /Pages /Kids [%s] /Count %d >>\n", $kidsStr, $totalPages);

        $objects[$fontBoldId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\n";
        $objects[$fontRegularId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\n";

        for ($p = 0; $p < $totalPages; $p++) {
            $pId = $pageObjIds[$p];
            $cId = $contentObjIds[$p];
            $stream = $this->pages[$p];
            $streamLen = strlen($stream);

            $objects[$pId] = sprintf(
                "<< /Type /Page /Parent %d 0 R /MediaBox [0 0 %.2f %.2f] /Contents %d 0 R /Resources << /Font << /F1 %d 0 R /F2 %d 0 R >> >> >>\n",
                $pagesId, $this->pageWidth, $this->pageHeight, $cId, $fontBoldId, $fontRegularId
            );

            $objects[$cId] = sprintf("<< /Length %d >>\nstream\n%sendstream\n", $streamLen, $stream);
        }

        // Assemble binary PDF output
        $out = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [];

        ksort($objects);
        foreach ($objects as $id => $body) {
            $offsets[$id] = strlen($out);
            $out .= sprintf("%d 0 obj\n%sendobj\n", $id, $body);
        }

        $xrefOffset = strlen($out);
        $totalObjsCount = count($objects);
        $out .= sprintf("xref\n0 %d\n", $totalObjsCount + 1);
        $out .= "0000000000 65535 f \n";

        for ($i = 1; $i <= $totalObjsCount; $i++) {
            $offset = $offsets[$i] ?? 0;
            $out .= sprintf("%010d 00000 n \n", $offset);
        }

        $out .= sprintf("trailer\n<< /Size %d /Root %d 0 R >>\n", $totalObjsCount + 1, $catalogId);
        $out .= sprintf("startxref\n%d\n%%%%EOF\n", $xrefOffset);

        return $out;
    }
}
