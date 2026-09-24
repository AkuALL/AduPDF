# AduPDF — Pembagian Tugas 5 Programmer V2 & Dependency-Chain Implementation Plan

**Project:** AduPDF — Sistem Reservasi & Pelaporan Fasilitas Kampus  
**Tech Stack:** Laravel + Blade  
**Programmer:** AL, Galang, Daniel, Abhi, Agil  
**Source of Truth:** `AduPDF_SRS_V2.md`  
**Strategi:** Domain ownership with dependency-chain grouping  
**Tujuan:** mempertahankan pembagian FR dan ownership V1; setiap perubahan Iterasi 2 dikerjakan oleh owner FR/domain yang sama seperti V1.

---

# 1. Prinsip Pembagian Tugas

Pembagian tugas menggunakan **dependency-chain grouping**. Satu programmer memegang satu domain secara end-to-end: model/migration, service, controller, route module, Blade view, validation, dan test yang menjadi bagian dari domain tersebut.

Prinsip utama:

1. Fitur yang saling bergantung kuat dikelompokkan pada owner yang sama.
2. Setiap task dan domain hanya memiliki satu owner utama.
3. Sebelum mengerjakan task, programmer/agent **wajib memeriksa codebase aktual**, bukan hanya tasklist.
4. Jika fitur A membutuhkan fitur B milik programmer lain, agent wajib memastikan B sudah tersedia di codebase.
5. Jika dependency belum tersedia, task A berstatus **BLOCKED**.
6. Agent yang blocked **tidak boleh membuat fitur B, temporary implementation, duplicate service/model/migration, atau route alternatif** karena berada di luar scope-nya.
7. Agent boleh beralih ke task lain miliknya yang dependency-nya sudah terpenuhi.
8. Perubahan lintas-domain harus diminta kepada owner domain terkait.
9. Defect hasil integration test dikembalikan ke owner domain; owner integrasi tidak mengambil alih business logic domain lain.
10. Satu fitur dianggap selesai setelah acceptance criteria dan test domain lulus.
11. Perubahan pada suatu FR dikerjakan oleh owner FR tersebut pada V1; ownership tidak berpindah hanya karena requirement direvisi.

---

# 2. Ringkasan Ownership Final

| Programmer | Domain Utama | Beban | Ownership Utama |
|---|---|---|---|
| **AL** | **Reservation End-to-End** | Sangat Tinggi | Pengajuan, validasi identitas, horizon 90 hari, auto-expire pending, conflict engine, room-tool rules, history/detail, H-2 cancellation, approval/reject, emergency cancellation, reservation contracts |
| **Agil** | **Facility + Availability + Room–Tool Relation** | Tinggi | Facility master, parent room-child tool, public catalog, search/filter, status kondisi, availability, admin facility management, deactivate integration |
| **Galang** | **Authentication + Registration + Profile + RBAC** | Sedang–Tinggi | User foundation, self-registration aktif, login/logout, profil NIM/NIP/No. Pegawai/WhatsApp, soft-delete account, role middleware/policy, account management, single Admin provisioning |
| **Abhi** | **Damage Report + Repair Flow** | Tinggi | Report, multi-attachment upload, tracking, Petugas processing, maintenance flow, report statistics contract |
| **Daniel** | **Dashboard + Recap/Export + Integration/QA** | Sedang–Tinggi | Shared UI shell, Petugas dashboard, occupancy/damage recap, CSV/Excel/PDF export, E2E/integration test dan merge coordination |

Pembagian ini sengaja membuat AL memegang seluruh chain Reservation yang paling kompleks, sedangkan Galang dan Agil menjadi dua foundation utama: **Identity/RBAC** dan **Facility/Availability**.

---

# 3. Dependency Graph Tingkat Tinggi

```text
GALANG
Authentication + RBAC
      │
      ├──────────────────┐
      ↓                  ↓
     AL                 ABHI
Reservation           Reporting
      ↑                  ↑
      │                  │
      └────── AGIL ──────┘
          Facility +
          Availability
               │
               ↓
            DANIEL
      Dashboard / Recap /
       Export / Integration
```

Hard dependency lintas-domain:

- **AL / Reservation** membutuhkan Auth/RBAC dari Galang dan Facility Core dari Agil.
- **Abhi / Reporting** membutuhkan Auth/RBAC dari Galang dan Facility Core dari Agil.
- **Agil / Public Availability final** membutuhkan occupancy/query contract dari AL.
- **Agil / Facility deactivation impact** membutuhkan ReservationImpactService dari AL.
- **Daniel / Petugas Dashboard** membutuhkan queue contract dari AL dan Abhi.
- **Daniel / Recap/Export** membutuhkan statistics/data contract dari AL, Agil, dan Abhi.

Internal dependency dalam domain yang sama **tidak menyebabkan saling tunggu antar-programmer**. Owner mengerjakannya sesuai urutan task domainnya.

---

# 4. Pembagian Detail per Programmer

## 4.1 AL — Reservation End-to-End

### Scope

AL menjadi owner tunggal seluruh lifecycle reservasi dan conflict engine.

### Task

**AL-01 — Reservation Foundation**
- Migration/table `reservations`.
- Model `Reservation`.
- Status: `menunggu`, `disetujui`, `ditolak`, `dibatalkan`.
- Tambahkan status `kedaluwarsa` untuk auto-expire oleh sistem.
- Field: user, facility, tujuan, start/end time, alasan pembatalan jika diperlukan.

**AL-02 — User Reservation Submission (FR-04)**
- Pengajuan reservasi.
- Jam operasional 07:00–20:00.
- Slot 30 menit.
- Validasi salah satu NIM/NIP/No. Pegawai dari profil sebelum submit.
- Tidak ada minimum lead time.
- Batas maksimal `now + 90 hari`.
- Facility reservability check.
- Reservation baru berstatus `menunggu`.

**AL-03 — Conflict Engine (FR-11)**
- Direct facility overlap.
- Relasi room-tool asimetris:
  - Full-room reservation memblokir seluruh alat di ruangan.
  - Reservasi alat hanya memblokir alat tersebut dan full-room reservation.
  - Alat sibling lain tetap dapat dipesan.
- Personal overlap:
  - User tidak boleh overlap lintas ruangan.
  - Jika user memesan alat di Room A pada slot overlap, tambahan alat hanya boleh dari Room A.
  - User tidak boleh meng-upgrade ke full-room reservation pada slot overlap walaupun alat yang sudah dipesan miliknya sendiri.
- Pending reservation belum menjadi occupancy final.

**AL-04 — User Reservation History & Cancellation (FR-05, FR-06)**
- Riwayat/detail reservasi user.
- Ownership validation.
- Pembatalan mandiri paling lambat tepat 48 jam sebelum `start_time`.

**AL-05 — Petugas Approval / Reject (FR-10)**
- Approve/reject reservation `menunggu`.
- Revalidasi konflik dengan state terbaru.
- Approval menggunakan database transaction.
- Saat satu reservation disetujui, pending reservation lain yang kini konflik menjadi `ditolak`.

**AL-06 — Emergency Cancellation (FR-12)**
- Petugas membatalkan reservation `disetujui`.
- Alasan pembatalan wajib.

**AL-07 — Reservation Contracts**
- `ReservationOccupancyQuery` untuk Agil.
- `ReservationQueueQuery` untuk Daniel.
- `ReservationImpactService` untuk Admin facility deactivation milik Agil.
- `ReservationStatisticsQuery` untuk recap Daniel.

**AL-08 — Pending Auto-Expire & Queue Contract**
- Job/command/service yang mengubah reservation `menunggu` menjadi `kedaluwarsa` ketika `start_time` tiba.
- Bersifat idempotent dan tidak memasukkan reservation kedaluwarsa ke occupancy.
- `ReservationQueueQuery` mengelompokkan antrian berdasarkan slot waktu; segmen slot terdekat dari now lebih dahulu, kemudian `created_at ASC` di dalam setiap segmen.

### Dependency

| Task | Hard Dependency |
|---|---|
| AL-01 | GAL-01 User Foundation + AG-01 Facility Foundation |
| AL-02 | AL-01 + AG-03 + GAL-05 Institutional Identity Contract |
| AL-03 | AL-01 + AG-01 + AG-03 |
| AL-04 | AL-02 |
| AL-05 | AL-03 + GAL-04 |
| AL-06 | AL-05 |
| AL-07 | AL-03 + AL-05 |
| AL-08 | AL-01 + scheduler/queue Laravel |

### Larangan Scope
AL tidak boleh membuat/mengubah Auth infrastructure, Facility schema/service internal, Report workflow, Admin facility CRUD, atau dashboard/recap milik Daniel.

Jika contract Galang/Agil belum tersedia, task terkait harus **BLOCKED**.

---

## 4.2 Agil — Facility, Availability & Room–Tool Relation

### Scope

Agil menjadi owner struktur fasilitas, hierarchy ruangan–alat, kondisi fasilitas, dan public availability.

### Task

**AG-01 — Facility Foundation**
- Migration/table `facilities`.
- Model `Facility`.
- Tipe: ruang kelas, aula, laboratorium, alat, lapangan.
- Status: `aktif`, `dalam_perbaikan`, `nonaktif`.
- Alat wajib memiliki satu parent room.
- Lapangan tidak memiliki child tool.

**AG-02 — Public Facility Catalog (FR-01, FR-02, FR-03)**
- Daftar fasilitas.
- Public data projection tanpa identitas/tujuan pemesan.
- Search/filter tipe, lokasi, kapasitas.
- Detail fasilitas dan child tool bila relevan.

**AG-03 — Facility Condition Contract**
- Service resmi untuk membaca/mengubah kondisi facility.
- Room `dalam_perbaikan`/`nonaktif` membuat child tool tidak reservable tanpa mengubah status tool satu-satu.
- Tool `dalam_perbaikan` tidak otomatis membuat parent room unavailable.
- Room tetap boleh dipesan jika salah satu alat sedang diperbaiki; informasi alat rusak dapat dikonfirmasi Petugas secara langsung kepada pengaju.

**AG-04 — Public Availability Integration**
- Gabungkan facility condition dengan occupancy reservation dari contract AL.
- Full-room reservation → seluruh child tools unavailable.
- Tool reservation → tool itu unavailable dan full-room unavailable.
- Sibling tools tetap dapat tersedia.

**AG-05 — Admin Facility Management (FR-18)**
- Tambah, lihat, edit, nonaktifkan.
- Tidak melakukan hard delete untuk facility yang memiliki histori.
- Validasi hierarchy room-tool.

**AG-06 — Absolute Deactivation Integration**
- Admin menonaktifkan facility secara absolut.
- Melalui `ReservationImpactService` milik AL:
  - `menunggu → ditolak`
  - `disetujui → dibatalkan`
- Tidak membutuhkan alasan Petugas.
- Child tools tidak perlu diubah status databasenya; menjadi unavailable karena parent `nonaktif`.

### Dependency

| Task | Hard Dependency |
|---|---|
| AG-01 | Tidak ada dependency fitur |
| AG-02 | AG-01 |
| AG-03 | AG-01 |
| AG-04 | AG-03 + AL-07 |
| AG-05 | AG-01 + GAL-04 |
| AG-06 | AG-05 + AL-07 |

### Larangan Scope
Agil tidak boleh membuat Reservation conflict/approval logic, mass reservation status transition sendiri, Report lifecycle, Auth/RBAC alternatif, atau recap final.

---

## 4.3 Galang — Authentication, Registration, Profile & RBAC

### Scope

Galang memegang seluruh lifecycle identitas dan authorization.

### Task

**GAL-01 — User Foundation**
- Migration/table `users`.
- Model `User`.
- Role: `pengguna`, `petugas`, `admin`.
- `institutional_id`, `identity_type`, `whatsapp`, dan `deleted_at` untuk profil/soft-delete.
- Provision tepat satu Admin pertama oleh developer.

**GAL-02 — Self Registration Pengguna**
- Registrasi mahasiswa/dosen/staf.
- Email unik dan validasi password.
- Registrasi hanya meminta email, nama lengkap, dan password.
- Akun baru langsung aktif dan dapat login.

**GAL-03 — Login & Logout**
- Login Pengguna/Petugas/Admin.
- Pengguna dapat login segera setelah registrasi berhasil.
- Logout.

**GAL-04 — RBAC & Ownership Infrastructure**
- Middleware role.
- Base Policy/Gate.
- Current authenticated user helper.
- Foundation authorization/ownership yang dipakai domain lain.

**GAL-05 — Profile & Institutional Identity (FR-17)**
- Edit nama, email, WhatsApp, password, serta NIM/NIP/No. Pegawai.
- Menetapkan `identity_type` + `institutional_id` secara konsisten.
- Menyediakan guard/helper `hasInstitutionalIdentity()` untuk Reservation.

**GAL-06 — Admin Account Management (FR-15, FR-16)**
- Admin membuat Petugas.
- Admin membuat Pengguna langsung.
- Admin tidak dapat membuat Admin lain.
- Admin dapat soft-delete akun role apa pun.
- Admin terakhir tidak dapat dihapus.

**GAL-07 — Admin Change Password**
- Admin tunggal dapat mengubah password sendiri.

### Dependency

| Task | Hard Dependency |
|---|---|
| GAL-01 | Tidak ada dependency fitur |
| GAL-02 | GAL-01 |
| GAL-03 | GAL-01 + GAL-02 |
| GAL-04 | GAL-03 |
| GAL-05 | GAL-03 + GAL-04 |
| GAL-06 | GAL-04 + GAL-05 |
| GAL-07 | GAL-03 |

### Output Contract
Setelah GAL-04 tersedia, domain lain boleh mengandalkan Laravel auth session, role middleware/policy, active-user access, dan ownership pattern. Setelah GAL-05 tersedia, Reservation dapat memakai guard identitas institusional.

### Larangan Scope
Galang tidak mengimplementasikan Facility, Reservation, Report, Dashboard, atau Recap/Export.

---

## 4.4 Abhi — Damage Report & Repair Flow

### Scope

Abhi menjadi owner domain laporan kerusakan dan maintenance workflow.

### Task

**AB-01 — Report Foundation**
- `reports`.
- `report_attachments`.
- Maksimum 8 attachment per report.
- Status: `baru`, `diproses`, `selesai`, `ditolak`.

**AB-02 — User Create Report (FR-07)**
- Facility, kategori, deskripsi.
- Minimal 1 dan maksimal 8 foto.
- Maksimum 2 MB per file.
- Format JPG/JPEG/PNG.
- MIME, ukuran, jumlah, dan storage validation.

**AB-03 — User Report Tracking (FR-08)**
- List/detail laporan milik user.
- Ownership enforcement.

**AB-04 — Petugas Report Processing (FR-13)**
- Queue laporan baru.
- Status processing/selesai/ditolak.
- Catatan resolusi ketika ditutup.

**AB-05 — Maintenance Integration (FR-14)**
- Ubah facility menjadi `dalam_perbaikan` melalui contract Agil.
- Kembalikan menjadi `aktif` setelah selesai jika sesuai.
- Tidak mengubah internal Facility secara langsung.

**AB-06 — Reporting Contracts**
- `ReportQueueQuery` untuk Daniel.
- `DamageStatisticsQuery` untuk Daniel.

### Dependency

| Task | Hard Dependency |
|---|---|
| AB-01 | GAL-01 + AG-01 |
| AB-02 | AB-01 + GAL-04 + AG-02 |
| AB-03 | AB-01 + GAL-04 |
| AB-04 | AB-01 + GAL-04 |
| AB-05 | AB-04 + AG-03 |
| AB-06 | AB-04 |

### Larangan Scope
Abhi tidak boleh mengubah Reservation rules, Facility internal schema/service, Auth/RBAC, atau implementasi Recap/Export final.

---

## 4.5 Daniel — Dashboard, Recap/Export & Integration/QA

### Scope

Daniel menjadi owner integrasi tampilan lintas-domain, reporting administratif, export, dan E2E validation.

### Task

**DA-01 — Shared App Shell & Navigation**
- Base Blade layout.
- Navigation berdasarkan role memakai contract Galang.
- Shared alert/status/empty/error components.
- Modular route aggregator.

**DA-02 — Petugas Dashboard (FR-09)**
- Reservation queue dari contract AL.
- Report queue dari contract Abhi.
- Tampilkan queue reservasi sebagai segmen slot waktu: slot terdekat dari now lebih dahulu, lalu `created_at ASC` di dalam segmen.
- Tidak membuat query domain sendiri jika contract belum tersedia.

**DA-03 — Admin Recap (FR-19)**
- Okupansi/penggunaan facility.
- Frekuensi kerusakan per facility/lokasi.
- Full-room reservation dihitung sebagai usage room.
- Penggunaan individual tool hanya dihitung dari explicit tool reservation.

**DA-04 — Export CSV / Excel / PDF**
- Export rekap berdasarkan filter.
- Tangani empty data dan generation error.

**DA-05 — Integration / E2E Test**
- Register → login langsung → lengkapi identitas → reservasi.
- Pengguna tanpa identitas → diarahkan ke Profil.
- Batas `now + 90 hari` dan pengajuan sesaat sebelum slot.
- Pending auto-expire saat `start_time`.
- Queue Petugas bersegmen slot dan `created_at ASC` di dalam segmen.
- Soft-delete akun tanpa menghapus histori.
- Facility discovery.
- Tool vs room availability.
- Reservation submit → approve → conflicting pending auto-reject.
- Report submit → process → facility condition.
- Admin deactivate facility → reservation impact.
- Recap/export.

**DA-06 — Final Regression & Merge Coordination**
- Konsistensi route/layout/menu/contracts.
- Menjaga shared file tidak diubah paralel tanpa koordinasi.
- Defect domain dikembalikan ke owner masing-masing.

### Dependency

| Task | Hard Dependency |
|---|---|
| DA-01 | GAL-04 untuk behavior role-aware final; skeleton boleh disiapkan sebelumnya |
| DA-02 | DA-01 + AL-07 + AB-06 |
| DA-03 | DA-01 + AG-01 + AL-07 + AB-06 |
| DA-04 | DA-03 |
| DA-05 | Semua feature utama selesai |
| DA-06 | Semua modul siap integrasi |

### Larangan Scope
Daniel tidak boleh membuat ulang Reservation/Report/Facility/Auth business logic hanya karena contract belum tersedia.

---

# 5. Mapping Functional Requirements ke Owner

| FR | Fitur | Owner |
|---|---|---|
| FR-01 | Melihat fasilitas & availability | Agil |
| FR-02 | Perlindungan informasi reservasi publik | Agil |
| FR-03 | Search/filter fasilitas | Agil |
| FR-04 | Pengajuan reservasi | AL |
| FR-05 | Pembatalan reservasi sendiri | AL |
| FR-06 | Riwayat/detail reservasi | AL |
| FR-07 | Pelaporan kerusakan | Abhi |
| FR-08 | Tracking laporan | Abhi |
| FR-09 | Dashboard antrian Petugas | Daniel |
| FR-10 | Approve/reject reservasi | AL |
| FR-11 | Validasi anti-bentrok | AL |
| FR-12 | Pembatalan darurat Petugas | AL |
| FR-13 | Pemrosesan laporan | Abhi |
| FR-14 | Perubahan kondisi fasilitas | Abhi melalui Facility contract Agil |
| FR-15 | Admin membuat Petugas | Galang |
| FR-16 | Admin membuat Pengguna | Galang |
| FR-17 | Pengelolaan profil dan identitas Pengguna | Galang |
| FR-18 | Admin kelola fasilitas | Agil |
| FR-19 | Rekap & export | Daniel |

Authentication register/login/logout tetap dimiliki Galang meskipun berada sebagai requirement lintas fitur.

---

# 6. Urutan Implementasi untuk Meminimalkan Saling Tunggu

## Phase 1 — Foundation Paralel

**Galang**
- GAL-01 → GAL-05 untuk foundation, RBAC, dan profile identity contract.

**Agil**
- AG-01 → AG-03.

**Daniel**
- DA-01 hanya boleh membuat skeleton layout/route modular yang tidak mengasumsikan business contract belum ada.

**AL dan Abhi**
- Setelah **GAL-01 User Foundation** dan **AG-01 Facility Foundation** benar-benar tersedia di codebase, AL boleh memulai AL-01 dan Abhi boleh memulai AB-01 tanpa menunggu GAL-04.
- Task controller/authorization yang membutuhkan RBAC tetap BLOCKED sampai GAL-04 tersedia.
- Sambil menunggu, keduanya boleh menyiapkan test plan, FormRequest design, atau struktur internal domain yang tidak mengambil ownership dependency.

## Phase 2 — Core Domain Paralel

Setelah GAL-04 dan AG-03 tersedia untuk task yang membutuhkan authorization/condition contract:

**AL**
- AL-01 → AL-06, lalu AL-08 untuk auto-expire dan queue contract.

**Abhi**
- AB-01 → AB-05.

Sementara:

**Galang**
- GAL-05 → GAL-07.

**Agil**
- AG-02 → AG-05.

## Phase 3 — Cross-Domain Contracts

**AL**
- AL-07 dan AL-08.

**Abhi**
- AB-06.

Setelah contract tersedia:

**Agil**
- AG-04 Public Availability Integration.
- AG-06 Absolute Deactivation Integration.

**Daniel**
- DA-02 Petugas Dashboard.
- DA-03 Admin Recap.

## Phase 4 — Export & Final Integration

**Daniel**
- DA-04 → DA-06.

Jika integration test menemukan defect:
- Reservation → AL.
- Facility/Availability → Agil.
- Authentication/RBAC → Galang.
- Report/Maintenance → Abhi.
- Dashboard/Recap/Export/Shared integration → Daniel.

---

# 7. Protokol Wajib Agent Sebelum Coding

Sebelum mengerjakan setiap task, agent wajib:

1. Sync/pull codebase terbaru.
2. Baca struktur repository dan file ownership.
3. Cari dependency yang tercantum pada task.
4. Verifikasi class/service/contract/migration/route/policy benar-benar sudah tersedia.
5. Jalankan test dependency bila tersedia.

**Tasklist bukan bukti dependency selesai. Codebase aktual adalah sumber bukti.**

Dependency dianggap tersedia hanya jika:
- file/class/contract ada;
- signature method yang diperlukan tersedia;
- schema/migration tersedia;
- middleware/policy/route yang diperlukan sudah terdaftar;
- dependency tidak berada dalam kondisi rusak yang jelas.

### Jika dependency belum ada

Agent wajib:

```text
STOP
→ tandai task BLOCKED
→ catat dependency yang hilang
→ sebutkan owner dependency
→ informasikan blocker
→ jangan membuat dependency di luar scope
→ lanjut ke task lain miliknya jika dependency task lain sudah tersedia
```

Agent **dilarang** membuat:
- duplicate model/service;
- temporary production service;
- placeholder database table;
- alternative auth/facility/reservation/report flow;
- route duplikat;
- copy-paste business logic milik domain lain.

Contoh:

```text
BLOCKED: AL-03 Conflict Engine
Missing dependency: AG-03 Facility Condition Contract
Owner: Agil
Evidence checked:
- app/Services/Facility
- app/Models/Facility.php
- routes/facilities.php

Action:
Stop AL-03.
Do not add Facility logic inside Reservation domain.
Continue only with AL task whose dependencies are satisfied.
```

---

# 8. Ownership File & No-Overlap Rule

| Area | Owner |
|---|---|
| `users`, auth, profile identity, role middleware/policy base | Galang |
| `facilities`, hierarchy, condition, public facility | Agil |
| `reservations`, conflict, approval/cancel | AL |
| `reports`, `report_attachments`, maintenance flow | Abhi |
| Shared Blade shell, dashboards, recap/export, E2E integration | Daniel |

Programmer lain boleh **memanggil contract**, tetapi tidak mengubah implementasi internal tanpa koordinasi owner.

### Route Isolation — Team Implementation Convention

Bagian ini adalah konvensi kolaborasi tim untuk mengurangi Git conflict; bukan business requirement baru pada SRS.


```text
routes/web.php                  → Daniel (aggregator only)
routes/auth.php                 → Galang
routes/admin-accounts.php       → Galang
routes/facilities.php           → Agil
routes/admin-facilities.php     → Agil
routes/reservations.php         → AL
routes/reports.php              → Abhi
routes/dashboards.php           → Daniel
routes/admin-recap.php          → Daniel
```

Setelah route modular aktif, feature route tidak boleh ditambahkan langsung ke `routes/web.php`.

---

# 9. Dependency Matrix

| Consumer | Dependency | Owner Dependency | Rule jika belum tersedia |
|---|---|---|---|
| AL Reservation | Auth/current user/RBAC | Galang | BLOCKED |
| AL Reservation | Facility model/hierarchy/condition | Agil | BLOCKED |
| Abhi Reporting | Auth/RBAC | Galang | BLOCKED |
| Abhi Reporting | Facility lookup/condition | Agil | BLOCKED |
| Agil Availability | Reservation occupancy contract | AL | BLOCKED untuk integration final |
| Agil Deactivation | Reservation impact contract | AL | BLOCKED |
| Daniel Dashboard | Reservation queue | AL | BLOCKED |
| Daniel Dashboard | Report queue | Abhi | BLOCKED |
| Daniel Recap | Reservation statistics | AL | BLOCKED |
| Daniel Recap | Damage statistics | Abhi | BLOCKED |
| Daniel Recap | Facility hierarchy | Agil | BLOCKED |
| Daniel role-aware UI | Auth/RBAC | Galang | Skeleton boleh; final behavior BLOCKED |

---

# 9.1 Global NFR & UX Responsibility

Semua owner domain wajib menerapkan NFR-01 sampai NFR-04 pada fitur miliknya; tanggung jawab ini **tidak dipindahkan seluruhnya ke Daniel**. Daniel menyediakan shared shell/component, sedangkan owner domain tetap bertanggung jawab atas perilaku UI dan validasi fitur masing-masing.

Global checklist setiap fitur:

- Laravel separation of concerns: Model/data access, Controller/request handling, service/business logic, dan Blade View dipisahkan secara logis.
- Validasi penting tersedia di client-side **dan** server-side; server tetap menjadi sumber validasi final.
- RBAC dan ownership diterapkan pada resource terproteksi.
- Blade UI responsif, user-friendly, konsisten dengan primary color `#2D4C79`, dan tidak membedakan status hanya dengan warna.
- Fitur memiliki loading/empty/error/success state yang relevan.
- Aksi destruktif atau berdampak besar memakai confirmation sesuai SRS.
- Commit/version-control mengikuti NFR-03 dan tidak mencampur scope domain lain tanpa koordinasi.

## 9.2 UX & Blade Page Ownership

| Owner | Halaman/UX utama |
|---|---|
| **Galang** | Login, Register, Profile, NIM/NIP/No. Pegawai, WhatsApp, Create Petugas, Create Pengguna, soft-delete account, account management |
| **Agil** | Facility List, Facility Detail, Availability, search/filter, Facility Management, warning tool `dalam_perbaikan`, confirmation deactivate |
| **AL** | Create Reservation, My Reservations, Reservation Detail, conflict/error feedback, H-2 cancellation confirmation, Petugas reservation action/detail |
| **Abhi** | Create Report, My Reports, Report Detail, upload 1–8 foto, Petugas report processing/detail |
| **Daniel** | Shared Blade layout/navigation/components, Petugas Dashboard, Admin Dashboard, Recap, Export, integration states |

Shared component milik Daniel boleh digunakan semua domain. Business behavior dan acceptance criteria halaman tetap milik owner domain masing-masing.

# 10. Definition of Done

Task dianggap selesai hanya jika:

- Scope task terpenuhi tanpa mengambil ownership domain lain.
- Validation dan business rule sesuai SRS.
- Authorization/ownership sesuai RBAC.
- Test positive, negative, dan edge case utama lulus.
- Tidak ada duplicate implementation untuk dependency.
- Contract lintas-domain terdokumentasi.
- Route dan file sesuai ownership.
- Code dapat diintegrasikan tanpa mengubah domain lain secara sepihak.
- Acceptance criteria task terpenuhi.
- NFR-01 sampai NFR-04 yang relevan terpenuhi pada domain tersebut.
- UX Needs SRS yang relevan terhadap fitur telah diuji.
- Untuk FR-07, report valid memiliki minimal 1 dan maksimal 8 foto JPG/JPEG/PNG, masing-masing maksimal 2 MB.

---

# 11. Ringkasan Strategi

Pembagian final:

```text
AL      → Reservation End-to-End
Agil    → Facility + Availability
Galang  → Authentication + RBAC
Abhi    → Damage Report + Repair
Daniel  → Dashboard + Recap/Export + Integration/QA
```

Strategi ini meminimalkan saling tunggu dengan menempatkan fitur yang **saling dependen erat pada owner yang sama**. Dependency lintas-domain hanya dipertahankan pada boundary yang memang tidak dapat dihilangkan secara sehat.

Aturan terpenting untuk semua programmer dan coding agent:

> **Inspect codebase first. Jika hard dependency belum tersedia, berhenti pada task tersebut. Jangan membuat dependency milik programmer lain hanya agar task sendiri dapat berjalan.**
