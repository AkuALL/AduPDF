# Ringkasan Pekerjaan Agil (Iterasi 2 / V2) & Rekomendasi Commit Message
**Tanggal:** 24 September 2026  
**Branch:** `feat/facility`  
**Domain:** Fasilitas, Ketersediaan Publik, & Relasi Hirarki Ruangan–Alat (`AG-01` s/d `AG-06`)  
**Status Akhir:** ✅ **100% Selesai & Terverifikasi (40 Tests Passed, 346 Assertions)**

---

## 1. Rekomendasi Commit Messages

Berikut beberapa opsi commit message berstandar *Conventional Commits* yang siap digunakan:

### Opsi A: Single Comprehensive Commit (Direkomendasikan)
Cocok jika ingin menggabungkan penyesuaian spesifikasi V2 dan tesnya ke dalam satu commit bersih:

```bash
git add routes/admin-facilities.php tests/Feature/Admin/FacilityManagementTest.php
git commit -m "feat(facility): support PATCH method for facility update per SRS V2 spec

- Update admin facility route to accept both PUT and PATCH methods
- Add feature test verifying facility update using PATCH method
- Ensure 100% compliance with AduPDF_SRS_V2 section 12.5 (AG-05)
- All 40 facility tests passing with 346 assertions"
```

### Opsi B: Granular / Split Commits
Cocok jika tim Anda menyukai pemisahan antara perubahan rute dan penambahan pengujian:

**Commit 1 (Route update):**
```bash
git add routes/admin-facilities.php
git commit -m "feat(routes): allow PATCH method on admin facility update endpoint"
```

**Commit 2 (Test coverage):**
```bash
git add tests/Feature/Admin/FacilityManagementTest.php
git commit -m "test(facility): add feature test for PATCH facility update per V2 spec"
```

---

## 2. Ringkasan Eksekutif Pekerjaan Malam Ini

Malam ini seluruh scope tugas Agil pada **Iterasi 2 (V2)** telah dianalisis, diimplementasikan, dan diverifikasi secara menyeluruh terhadap dokumen resmi di `docs/`:
1. `AduPDF_SRS_V2.md`
2. `AduPDF_Jobdesc_Programmer_V2.md`

Semua aturan bisnis, batasan hak akses, proteksi privasi, hierarki ruangan-alat, hingga integrasi deaktivasi dengan modul reservasi (domain AL) dinyatakan **100% compliant** tanpa mengubah UI (`resources/js/...`) maupun susunan tech stack.

---

## 3. Rincian Kronologi & Pekerjaan yang Dilakukan

### A. Investigasi Lingkungan & Tech Stack
- Mendiagnosis kendala manifest Vite pada endpoint `/login` dan memastikan service MySQL local (`MySQL80`) berjalan dengan normal.
- Memverifikasi tech stack inti: **Laravel 11, Inertia.js, React (TypeScript), Tailwind CSS, Pest, & MySQL**.

### B. Audit Dokumen SRS V2 & Jobdesc Programmer V2
- Melakukan cross-check menyeluruh antara dokumen V1 dan V2 untuk mengidentifikasi apa saja perubahan yang menjadi tanggung jawab Agil vs anggota tim lain:
  - **Tugas Rekan Tim (Di luar domain Agil)**:
    - *Galang (`GAL-05`, `GAL-06`)*: Kelengkapan profil pengguna (NIM/NIP, WhatsApp) & Soft-delete akun user.
    - *AL (`AL-08`, `AL-02`)*: Auto-expire reservasi pending (`kedaluwarsa`) & horizon pemesanan 90 hari.
    - *Daniel (`DA-02`, `DA-03`)*: Segmen antrean petugas terdekat & Rekap dashboard admin.
    - *Abhi (`AB-01` s/d `AB-06`)*: Modul pelaporan kerusakan & handling petugas.
  - **Tugas Agil (`AG-01` s/d `AG-06`)**:
    - Fokus pada Fasilitas, Slot Ketersediaan Publik, Asimetri Ruangan-Alat, dan CRUD Admin.

### C. Identifikasi Gap & Penyesuaian Spesifikasi V2
- Menemukan gap spesifikasi API pada dokumen `AduPDF_SRS_V2.md` Bagian 12.5:
  - Endpoint update fasilitas admin didefinisikan sebagai `PATCH /admin/facilities/{facility}`.
  - Sebelumnya route hanya menangani method `PUT`.
- **Implementasi**:
  - Memperbarui `routes/admin-facilities.php` menggunakan `Route::match(['put', 'patch'], ...)` sehingga mendukung backward-compatibility untuk `PUT` dan kepatuhan penuh terhadap spesifikasi V2 untuk `PATCH`.
  - Menambahkan automated feature test di `tests/Feature/Admin/FacilityManagementTest.php` untuk memastikan payload update via method `PATCH` berhasil diproses dan tersimpan ke database.

### D. Verifikasi & Jaminan Kualitas (QA)
- **Pest PHP**: Menjalankan seluruh test suite domain fasilitas (`php artisan test --filter=Facility`):
  - **Hasil**: `40 passed (346 assertions)`.
- **Laravel Pint**: Menjalankan pengecekan linter/formatter (`vendor/bin/pint --dirty`):
  - **Hasil**: `Clean (No code style violations)`.

---

## 4. Matriks Kepatuhan Scope Agil (AG-01 s/d AG-06)

| Kode | Domain / Fitur | Status | File Implementasi Utama |
| :--- | :--- | :---: | :--- |
| **AG-01** | **Entity Fasilitas & Relasi Hirarki**<br>- 5 Tipe (`ruang_kelas`, `aula`, `laboratorium`, `alat`, `lapangan`)<br>- 3 Kondisi (`aktif`, `dalam_perbaikan`, `nonaktif`)<br>- Validasi hirarki ketat: Alat wajib memiliki ruangan induk; Lapangan tidak boleh berinduk/memiliki anak alat. | ✅ Selesai | `app/Models/Facility.php`<br>`app/Enums/FacilityType.php`<br>`app/Enums/FacilityCondition.php`<br>`database/migrations/2026_09_16_000000_create_facilities_table.php` |
| **AG-02** | **Katalog Publik & Detail (FR-01, FR-02, FR-03)**<br>- Filter pencarian, tipe, lokasi, kapasitas minimal, pagination.<br>- Empty state handling.<br>- Proteksi privasi publik (tidak mengekspos NIM/nama peminjam/tujuan acara pada data publik). | ✅ Selesai | `app/Http/Controllers/FacilityController.php`<br>`routes/facilities.php` |
| **AG-03** | **Service Kondisi Fasilitas & Blokade Asimetris**<br>- Ruangan `dalam_perbaikan`/`nonaktif` otomatis memblokade alat di dalamnya.<br>- Alat `dalam_perbaikan`/`nonaktif` TIDAK memblokade ruangan induknya. | ✅ Selesai | `app/Services/FacilityConditionService.php` |
| **AG-04** | **Service Ketersediaan Publik (Slot Grid)**<br>- Jam operasional 07:00–20:00 WIB (26 slot @ 30 menit).<br>- Integrasi query okupansi reservasi & blokade hierarki ruangan-alat. | ✅ Selesai | `app/Services/FacilityAvailabilityService.php`<br>`app/Http/Controllers/FacilityAvailabilityController.php` |
| **AG-05** | **Manajemen Fasilitas Admin (FR-18)**<br>- CRUD fasilitas lengkap.<br>- Validasi form hierarki ketat.<br>- Dukungan method `PUT` & `PATCH /admin/facilities/{facility}` sesuai V2. | ✅ Selesai | `app/Http/Controllers/Admin/FacilityManagementController.php`<br>`app/Http/Requests/Admin/StoreFacilityRequest.php`<br>`app/Http/Requests/Admin/UpdateFacilityRequest.php`<br>`routes/admin-facilities.php` |
| **AG-06** | **Integrasi Deaktivasi Fasilitas (FR-18)**<br>- Endpoint deaktivasi memanggil `ReservationImpactService::onFacilityDeactivated` (domain AL) untuk auto-reject pending dan auto-cancel approved secara atomik dalam DB Transaction. | ✅ Selesai | `app/Http/Controllers/Admin/FacilityManagementController.php` (`deactivate` method) |

---

## 5. File yang Mengalami Perubahan (Working Tree)

1. `routes/admin-facilities.php`
   - *Perubahan*: Mendukung method `PATCH` dan `PUT` untuk update fasilitas.
2. `tests/Feature/Admin/FacilityManagementTest.php`
   - *Perubahan*: Menambahkan test case `admin can update a facility using PATCH method per SRS V2 spec`.
3. `docs/SUMMARY_AGIL_V2.md` *(File ini)*
   - *Perubahan*: Dokumentasi ringkasan kerja dan rekomendasi commit messages.
