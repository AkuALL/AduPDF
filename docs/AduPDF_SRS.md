AduPDF

Sistem Reservasi & Pelaporan Fasilitas Kampus

SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

Versi revisi hasil pembahasan — business rules fasilitas & reservasi dikunci
Tech Stack: Laravel + Blade
Primary UI Color: #2D4C79

> Status dokumen: Konsolidasi final hasil analisis draft, 17 User Story proyek, dan keputusan business rule yang telah dikunci sampai 15 September 2026. Tidak ada Open Decision aktif untuk domain reservasi ruangan–alat, approval konflik, pembatalan, provisioning Admin, penonaktifan fasilitas, upload laporan, dan rekap penggunaan.

# Dasar Penyusunan

Dokumen ini disusun berdasarkan spesifikasi proyek PPK 2026, draft SRS AduPDF sebelumnya, serta keputusan yang telah disepakati dalam diskusi revisi. Terminologi dan kebutuhan utama mengikuti sumber proyek; keputusan tambahan yang belum ditentukan sumber ditandai sebagai TBD/Open Decision dan tidak diasumsikan secara diam-diam.

- DetailProyekPPK2026.pdf — ketentuan umum, 17 User Story, aturan waktu reservasi, aktor, dan hint rancangan database.
- DRAFT_AduPDF.pdf — draft kebutuhan fungsional, non-fungsional, business rules, dan rancangan database awal.
- Keputusan diskusi — Laravel + Blade, warna utama #2D4C79, dekomposisi 17 User Story menjadi 19 FR, registrasi mandiri Pengguna wajib melalui verifikasi Admin, pemisahan status laporan dan status kondisi fasilitas.
# 1. Pendahuluan dan Ruang Lingkup

## 1.1 Tujuan Dokumen

Software Requirements Specification (SRS)
AduPDF: Sistem Reservasi & Pelaporan Fasilitas Kampus

## 1.2 Gambaran Umum Sistem

AduPDF adalah aplikasi web terpusat untuk membantu pengelolaan penggunaan fasilitas kampus. Sistem mendukung pengecekan fasilitas dan ketersediaan slot, reservasi, persetujuan/penolakan reservasi, pelaporan kerusakan, penanganan laporan, perubahan kondisi fasilitas, pengelolaan akun dan master fasilitas, serta rekapitulasi penggunaan dan kerusakan.

## 1.3 In Scope

- Daftar fasilitas dan ketersediaan per slot waktu.
- Pencarian dan filter berdasarkan tipe, lokasi, dan kapasitas.
- Registrasi mandiri Pengguna dan verifikasi Admin sebelum login.
- Login dan logout sesuai role.
- Pengajuan, riwayat, detail, dan pembatalan reservasi Pengguna.
- Approval/rejection reservasi oleh Petugas dengan validasi anti-bentrok.
- Pembatalan darurat reservasi oleh Petugas dengan alasan wajib.
- Pelaporan kerusakan dengan kategori, deskripsi, dan foto.
- Pelacakan status laporan oleh Pengguna.
- Pemrosesan laporan dan perubahan kondisi fasilitas oleh Petugas.
- Pembuatan akun Petugas/Pengguna oleh Admin sesuai kewenangan.
- Pengelolaan fasilitas: tambah, lihat, ubah, dan nonaktifkan.
- Rekap okupansi dan frekuensi kerusakan serta export CSV/Excel/PDF.
## 1.4 Out of Scope

- Pembayaran penggunaan fasilitas.
- Integrasi kalender eksternal kecuali ditambahkan melalui change request.
- Notifikasi WhatsApp/email jika tidak dinyatakan dalam perubahan requirement.
- Aplikasi mobile native Android/iOS.
- SSO kampus jika tidak ditambahkan melalui change request.
- Fitur di luar 17 User Story sumber tanpa persetujuan perubahan ruang lingkup.

# 2. Terminologi dan Definisi

| Istilah | Definisi |
| --- | --- |
| Pengunjung / Guest | Pengakses yang belum login dan hanya dapat menggunakan informasi publik. |
| Pengguna | Mahasiswa, dosen, atau staf yang memiliki akun; akun hasil registrasi mandiri harus diverifikasi Admin sebelum dapat login. |
| Petugas | Aktor yang memproses reservasi dan laporan kerusakan serta memperbarui kondisi fasilitas. Akunnya dibuat Admin. |
| Admin | Aktor yang mengelola akun, verifikasi Pengguna, data fasilitas, serta rekapitulasi. |
| Fasilitas | Objek kampus yang dikelola sistem: ruang kelas, aula, laboratorium, alat, atau lapangan. |
| Reservasi | Pengajuan penggunaan satu fasilitas pada rentang waktu tertentu. |
| Slot Waktu | Unit waktu reservasi berdurasi 30 menit. |
| Bentrok Reservasi | Kondisi dua reservasi pada fasilitas sama memiliki interval waktu yang overlap. |
| Status Reservasi | menunggu, disetujui, ditolak, dibatalkan. |
| Laporan Kerusakan | Laporan Pengguna mengenai masalah/kerusakan suatu fasilitas. |
| Status Laporan | baru, diproses, selesai, ditolak. |
| Status Kondisi Fasilitas | aktif, dalam_perbaikan, nonaktif. |
| Okupansi | Pemakaian fasilitas yang dihitung dari data reservasi sesuai definisi rekap yang diterapkan. |
| RBAC | Role-Based Access Control; pembatasan akses berdasarkan peran aktor. |
| Ownership Authorization | Pembatasan resource berdasarkan kepemilikan, misalnya Pengguna hanya boleh melihat reservasi miliknya. |
| Ruangan | Fasilitas bertipe ruang kelas, aula, atau laboratorium yang dapat menjadi lokasi/induk bagi fasilitas bertipe alat. Lapangan tidak memiliki alat di dalamnya. |
| Alat | Fasilitas yang berada pada satu ruangan tertentu. Reservasi alat memengaruhi availability ruangan induknya pada slot yang overlap. |
| Reservasi Ruangan Penuh | Reservasi terhadap ruangan yang memberikan akses terhadap seluruh alat yang terdaftar di dalam ruangan tersebut selama periode reservasi dan membuat alat-alat tersebut tidak dapat dipesan terpisah pada slot yang sama. |
| Deadline H-2 | Batas pembatalan oleh Pengguna adalah tepat 48 jam sebelum start_time reservasi. |

# 3. Aktor dan Hak Akses (RBAC)

## 3.1 Aktor Sistem

Pengunjung: Akses publik tanpa login.

Pengguna: Mahasiswa/Dosen/Staf dengan akun terverifikasi.

Petugas: Memproses reservasi, laporan, dan kondisi fasilitas.

Admin: Mengelola akun, verifikasi, fasilitas, dan rekap.

## 3.2 Matriks RBAC

| Aksi | Guest | Pengguna | Petugas | Admin |
| --- | --- | --- | --- | --- |
| Melihat daftar fasilitas | ✓ | ✓ | ✓ | ✓ |
| Melihat ketersediaan | ✓ | ✓ | ✓ | ✓ |
| Search/filter fasilitas | ✓ | ✓ | ✓ | ✓ |
| Registrasi mandiri Pengguna | ✓ | — | ✗ | ✗ |
| Login/logout | — | ✓* | ✓ | ✓ |
| Membuat reservasi | ✗ | ✓ | ✗ | ✗ |
| Membatalkan reservasi sendiri | ✗ | ✓ | ✗ | ✗ |
| Melihat riwayat reservasi sendiri | ✗ | ✓ | ✗ | ✗ |
| Membuat laporan | ✗ | ✓ | ✗ | ✗ |
| Melacak laporan sendiri | ✗ | ✓ | ✗ | ✗ |
| Approve/reject reservasi | ✗ | ✗ | ✓ | ✗ |
| Cancel reservasi darurat | ✗ | ✗ | ✓ | ✗ |
| Memproses laporan | ✗ | ✗ | ✓ | ✗ |
| Mengubah kondisi fasilitas | ✗ | ✗ | ✓ | — |
| Membuat akun Petugas | ✗ | ✗ | ✗ | ✓ |
| Membuat akun Pengguna | ✗ | ✗ | ✗ | ✓ |
| Verifikasi/tolak registrasi | ✗ | ✗ | ✗ | ✓ |
| Kelola fasilitas | ✗ | ✗ | ✗ | ✓ |
| Lihat/export rekap | ✗ | ✗ | ✗ | ✓ |

Keterangan: ✓* = login hanya diperbolehkan setelah akun Pengguna disetujui/verifikasi Admin. Tanda “—” berarti aksi tersebut bukan aksi utama role tersebut atau tidak relevan.

## 3.3 Aturan Otorisasi Resource

- Pengguna hanya boleh melihat dan membatalkan reservasi miliknya sendiri.
- Pengguna hanya boleh melihat laporan yang dibuat oleh dirinya sendiri.
- Petugas dan Admin hanya memperoleh akses sesuai role dan modul yang dinyatakan pada RBAC.
- Pengecekan role tidak menggantikan pengecekan ownership; keduanya perlu diterapkan pada resource yang relevan.
# 4. Aturan Bisnis

| ID | Nama | Aturan |
| --- | --- | --- |
| BR-01 | Jam Operasional | Reservasi hanya boleh berada pada rentang 07:00–20:00 WIB. |
| BR-02 | Slot Waktu | Start time dan end time harus berada pada kelipatan slot 30 menit. |
| BR-03 | Validasi Server | Aturan waktu, bentrok, hak akses, dan validasi penting wajib diverifikasi server-side; UI hanya validasi tambahan. |
| BR-04 | Akses Publik | Guest dapat melihat fasilitas, ketersediaan, dan melakukan search/filter tanpa login. |
| BR-05 | Registrasi Pengguna | Mahasiswa/Dosen/Staf dapat membuat akun secara mandiri. |
| BR-06 | Verifikasi Pengguna | Akun hasil registrasi mandiri berstatus pending dan tidak dapat login sebelum Admin menyetujui. Admin dapat approve atau reject. |
| BR-07 | Akun Petugas | Petugas tidak melakukan registrasi mandiri; akun Petugas dibuat langsung oleh Admin. |
| BR-08 | Privasi Jadwal | Guest hanya melihat status tersedia/tidak tersedia dan tidak boleh melihat identitas pemesan atau tujuan reservasi. |
| BR-09 | Anti-Bentrok & Konflik | Approval reservasi wajib mempertimbangkan konflik langsung pada fasilitas, relasi ruangan–alat, serta overlap reservasi milik Pengguna. Sistem tidak boleh menghasilkan kombinasi reservasi disetujui yang melanggar aturan tersebut. |
| BR-10 | Kondisi Fasilitas | Fasilitas yang dirinya berstatus dalam_perbaikan atau nonaktif tidak dapat dipesan. Jika ruangan dalam_perbaikan/nonaktif, seluruh alat di dalamnya tidak reservable. Jika hanya satu alat dalam_perbaikan, alat tersebut tidak reservable tetapi ruangan induk tetap boleh diajukan untuk reservasi penuh; Petugas dapat menginformasikan kondisi alat secara langsung kepada pengaju. |
| BR-11 | Pembatalan Pengguna H-2 | Pengguna hanya boleh membatalkan reservasi miliknya paling lambat tepat 48 jam sebelum start_time. Setelah melewati batas tersebut, pembatalan oleh Pengguna ditolak. |
| BR-12 | Pembatalan Darurat | Petugas boleh membatalkan reservasi yang telah disetujui dalam kondisi darurat dan wajib mengisi alasan. |
| BR-13 | Status Laporan | Status laporan hanya: baru, diproses, selesai, ditolak. “dalam_perbaikan” adalah status kondisi fasilitas, bukan status laporan. |
| BR-14 | Nonaktif Fasilitas oleh Admin | Admin dapat menonaktifkan fasilitas tanpa hard delete. Penonaktifan bersifat absolut: seluruh reservasi yang belum selesai pada fasilitas tersebut diputus otomatis; status menunggu menjadi ditolak dan status disetujui menjadi dibatalkan. Tidak diperlukan tindakan/alasan Petugas dan tidak ada pesan pembatalan khusus; perubahan status tetap terlihat di riwayat. |
| BR-15 | Relasi Ruangan–Alat | Fasilitas bertipe alat wajib terkait ke satu ruangan induk. Ruangan yang dapat memiliki alat adalah ruang kelas, aula, dan laboratorium. Lapangan tidak memiliki alat. |
| BR-16 | Availability Ruangan–Alat | Jika ruangan direservasi penuh pada slot tertentu, seluruh alat di dalamnya menjadi tidak tersedia untuk reservasi terpisah pada slot overlap. Jika satu atau lebih alat dalam ruangan telah direservasi/disetujui, ruangan induknya tidak dapat direservasi penuh pada slot overlap, tetapi alat lain yang masih tersedia di ruangan tersebut tetap dapat dipesan oleh Pengguna lain. |
| BR-17 | Batas Overlap Pengguna | Pengguna boleh memiliki beberapa pengajuan, tetapi pada waktu overlap tidak boleh berpindah lintas ruangan. Jika Pengguna memiliki reservasi alat di Ruang A, ia hanya boleh menambah reservasi alat lain yang tersedia di Ruang A pada waktu overlap. Ia tidak boleh mengajukan reservasi penuh Ruang A pada waktu overlap meskipun alat yang sudah dipesan adalah miliknya sendiri, dan tidak boleh memiliki reservasi overlap pada ruangan lain. Di waktu yang tidak overlap, Pengguna boleh memesan fasilitas pada ruangan lain. |
| BR-18 | Provisioning Admin | Sistem hanya memiliki satu Admin. Akun Admin pertama dibuat/provision oleh developer, tidak melalui registrasi, dan Admin dapat mengganti password sendiri. Admin tidak dapat membuat akun Admin lain. |
| BR-19 | Upload Foto Laporan | Satu laporan dapat memiliki maksimal 8 foto. Setiap file maksimal 2 MB dan hanya format JPG, JPEG, atau PNG yang diperbolehkan. |
| BR-20 | Resolusi Pengajuan Konflik | Beberapa pengajuan yang saling konflik boleh sama-sama berstatus menunggu. Petugas menentukan pengajuan yang diprioritaskan untuk approval. Setelah satu pengajuan disetujui, seluruh pengajuan lain yang masih menunggu dan menjadi konflik terhadap reservasi tersebut otomatis berubah menjadi ditolak. |
| BR-21 | Rekap Penggunaan Ruangan–Alat | Reservasi penuh ruangan dihitung sebagai penggunaan ruangan. Alat di dalam ruangan menjadi unavailable selama reservasi penuh, tetapi tidak menambah frekuensi penggunaan individual alat. Frekuensi penggunaan individual alat hanya dihitung dari reservasi alat yang dilakukan secara eksplisit. |

> Keputusan terkunci: deadline pembatalan Pengguna adalah H-2 (tepat 48 jam sebelum start_time); hanya satu Admin yang diprovision developer; Admin nonaktifkan fasilitas bersifat absolut; upload laporan maksimal 8 foto × 2 MB JPG/JPEG/PNG; relasi room–tool bersifat asimetris; pending conflict diputus Petugas dan pending lain yang konflik otomatis ditolak setelah approval; overlap Pengguna lintas ruangan dilarang; room reservation dihitung sebagai usage room, sedangkan usage tool hanya dari reservasi tool eksplisit.

# 5. Alur Utama per Domain

## 5.1 Authentication & Account Verification

```text
Pengguna belum punya akun
        ↓
Registrasi mandiri
        ↓
Validasi data
        ↓
Akun dibuat: pending
        ↓
Admin memproses
   ├── Reject → akun tidak dapat login
   └── Approve → akun aktif → dapat login
```

Saat login, sistem tetap memverifikasi kredensial dan status verifikasi. Kredensial benar tetapi status belum approved tetap menghasilkan penolakan login dengan pesan yang sesuai.

## 5.2 Facility Discovery

```text
Buka daftar fasilitas
        ↓
Search / Filter
        ↓
Pilih fasilitas
        ↓
Lihat detail
        ↓
Pilih tanggal / slot
        ↓
Lihat status tersedia / tidak tersedia
```

Availability harus memperhitungkan relasi ruangan–alat secara asimetris: reservasi penuh ruangan memblokir seluruh alat di dalamnya, sedangkan reservasi satu alat hanya memblokir alat tersebut dan reservasi penuh ruangan induk; alat sibling yang masih tersedia tetap dapat dipesan oleh Pengguna lain. Pengajuan berstatus menunggu belum menjadi occupancy final sampai Petugas menentukan approval.

## 5.3 Reservasi

```text
Pengguna pilih fasilitas (ruangan / alat)
        ↓
Pilih start_time & end_time
        ↓
Isi tujuan penggunaan
        ↓
Validasi server: jam, slot, kondisi fasilitas, ownership, relasi ruangan–alat, dan overlap Pengguna
   ├── Invalid → tampilkan error
   └── Valid → buat reservasi status=menunggu
                    ↓
             Petugas memilih pengajuan
                    ↓
               Cek bentrok terbaru
           ├── Bentrok dengan approved → tidak dapat di-approve / ditolak
           └── Tidak bentrok → approve
                    ↓
        Sistem menolak otomatis pengajuan menunggu lain yang kini konflik
```

## 5.4 Pembatalan Reservasi

```text
Oleh Pengguna:
Reservasi sendiri → cek deadline 48 jam sebelum start_time → valid? → dibatalkan / ditolak

Oleh Petugas:
Reservasi disetujui → kondisi darurat → isi alasan wajib → dibatalkan

Oleh Sistem akibat Admin menonaktifkan fasilitas:
Facility → nonaktif → menunggu=ditolak otomatis; disetujui=dibatalkan otomatis → tanpa alasan Petugas / pesan pembatalan khusus
```

## 5.5 Pelaporan Kerusakan

```text
Pengguna pilih fasilitas
        ↓
Isi kategori + deskripsi + maksimal 8 foto (JPG/JPEG/PNG, masing-masing ≤2 MB)
        ↓
Submit laporan → status=baru
        ↓
Petugas proses → status=diproses
        ↓
Jika perlu perbaikan: facility=dalam_perbaikan
        ↓
Selesai → report=selesai + catatan resolusi
        ↓
facility=aktif (jika sudah layak digunakan)
```

## 5.6 Administrasi

```text
Admin awal diprovision developer (hanya satu Admin)
        ↓
Admin Dashboard
   ├── Verification Queue
   ├── Account Management
   │      ├── Create Petugas
   │      └── Create Pengguna
   ├── Facility Management
   │      └── Nonaktifkan → putus otomatis seluruh reservasi belum selesai
   ├── Change Password
   └── Recap & Export
```

# 6. Functional Requirements

Functional Requirements diturunkan dari 17 User Story. US-01 dan US-09 masing-masing didekomposisi menjadi dua requirement atomik, sehingga total menjadi 19 FR. Dekomposisi ini menjaga traceability tanpa memaksa jumlah FR sama dengan jumlah User Story.

## 6.1 Pengunjung

### FR-01 — Melihat Fasilitas dan Ketersediaan

Sistem memungkinkan Guest melihat daftar fasilitas dan status ketersediaannya per slot tanpa login.

Perilaku/Aturan

- Informasi publik menampilkan status tersedia/tidak tersedia.
- Ketersediaan harus mencerminkan kondisi fasilitas dan reservasi yang telah disetujui.
Acceptance Criteria

- Guest dapat membuka daftar fasilitas tanpa login.
- Slot yang tidak tersedia ditampilkan tanpa membocorkan detail reservasi.
### FR-02 — Perlindungan Informasi Reservasi

Sistem menyembunyikan identitas pemesan, detail akun, dan tujuan penggunaan dari Guest.

Acceptance Criteria

- Guest tidak menerima nama pemesan atau tujuan reservasi melalui tampilan publik.
### FR-03 — Pencarian dan Filter Fasilitas

Sistem memungkinkan Guest/Pengguna mencari dan memfilter fasilitas berdasarkan tipe, lokasi, dan kapasitas.

Acceptance Criteria

- Kriteria filter menghasilkan daftar yang sesuai.
- Kondisi tanpa hasil menampilkan empty state.
## 6.2 Pengguna

### FR-04 — Pengajuan Reservasi

Pengguna terverifikasi dapat mengajukan reservasi untuk fasilitas tertentu pada rentang waktu tertentu dengan tujuan penggunaan.

Preconditions

- Pengguna login dan akun approved.
- Fasilitas aktif.
Perilaku/Aturan

- Waktu mengikuti BR-01 dan BR-02.
- Reservasi baru berstatus menunggu.
- Jika fasilitas bertipe ruangan, reservasi penuh memblokir seluruh alat di dalam ruangan untuk reservasi terpisah selama periode overlap; alat yang sedang dalam_perbaikan tetap tidak dapat digunakan dan tidak otomatis membuat ruangan tidak reservable.
- Jika fasilitas bertipe alat, reservasi alat membuat ruangan induk tidak dapat direservasi penuh pada periode overlap, tetapi alat lain yang tersedia di ruangan yang sama tetap dapat dipesan oleh Pengguna lain.
- Pengguna boleh memiliki beberapa pengajuan. Pada waktu overlap, Pengguna yang sudah memiliki reservasi alat di suatu ruangan hanya boleh menambah alat lain pada ruangan yang sama; tidak boleh lintas ruangan dan tidak boleh mengajukan reservasi penuh ruangan tersebut pada slot overlap, walaupun reservasi alat sebelumnya miliknya sendiri.

Acceptance Criteria

- Data valid tersimpan sebagai reservasi menunggu.
- Data waktu invalid ditolak server.
### FR-05 — Pembatalan Reservasi Sendiri

Pengguna dapat membatalkan reservasi miliknya sebelum deadline pembatalan.

Preconditions

- Reservasi dimiliki Pengguna yang login.
Perilaku/Aturan

- Deadline pembatalan adalah tepat 48 jam sebelum start_time (H-2).
- Pengguna tidak boleh membatalkan reservasi milik orang lain.
Acceptance Criteria

- Pembatalan valid mengubah status menjadi dibatalkan.
- Pembatalan setelah deadline ditolak.
### FR-06 — Riwayat dan Detail Reservasi

Pengguna dapat melihat riwayat lengkap, detail, dan status reservasi miliknya.

Acceptance Criteria

- Hanya reservasi pemilik yang tampil.
- Status ditampilkan konsisten: menunggu/disetujui/ditolak/dibatalkan.
### FR-07 — Pelaporan Kerusakan

Pengguna dapat membuat laporan kerusakan untuk fasilitas tertentu.

Perilaku/Aturan

- Input minimal: fasilitas, kategori, deskripsi, dan foto pendukung.
- Maksimal 8 foto per laporan; setiap file maksimal 2 MB; format yang diterima: JPG, JPEG, PNG.

- File foto harus divalidasi jumlah, tipe MIME/ekstensi, dan ukuran di server.
Acceptance Criteria

- Laporan valid tersimpan dengan status baru.
### FR-08 — Pelacakan Status Laporan

Pengguna dapat melihat laporan miliknya dan status penanganannya.

Acceptance Criteria

- Status yang tampil hanya: baru, diproses, selesai, ditolak.
## 6.3 Petugas

### FR-09 — Dashboard Antrian

Petugas melihat reservasi berstatus menunggu dan laporan berstatus baru untuk diproses.

Acceptance Criteria

- Dashboard memisahkan antrian reservasi dan laporan sesuai status awal masing-masing.
### FR-10 — Approve/Reject Reservasi

Petugas dapat menyetujui atau menolak reservasi berstatus menunggu.

Preconditions

- Petugas login.
- Reservasi berstatus menunggu.
Acceptance Criteria

- Approval hanya berhasil setelah validasi konflik terbaru lolos. Setelah satu pengajuan disetujui, pengajuan menunggu lain yang kini konflik otomatis berubah menjadi ditolak; reject manual tetap tersedia bagi Petugas.
### FR-11 — Validasi Anti-Bentrok

Sistem wajib memblokir approval apabila reservasi menimbulkan konflik resource atau konflik overlap Pengguna berdasarkan aturan fasilitas langsung dan relasi ruangan–alat.

Perilaku/Aturan

- Pengecekan dilakukan server-side saat approval dan menggunakan state reservasi terbaru dalam transaction.
- Konflik ruangan–alat bersifat asimetris: full-room reservation memblokir semua child tools; tool reservation memblokir tool tersebut dan full-room reservation, tetapi tidak memblokir sibling tools yang tersedia. UI availability bukan sumber validasi final.
Acceptance Criteria

- Approval yang melanggar konflik resource/personal selalu ditolak. Pengajuan menunggu yang menjadi konflik setelah approval pengajuan lain otomatis diubah menjadi ditolak.
### FR-12 — Pembatalan Darurat oleh Petugas

Petugas dapat membatalkan reservasi yang sudah disetujui dalam kondisi darurat dengan alasan wajib.

Acceptance Criteria

- Tanpa alasan, pembatalan ditolak.
- Alasan tersimpan pada reservasi.
### FR-13 — Pemrosesan Laporan

Petugas dapat memperbarui laporan menjadi diproses, selesai, atau ditolak dan memberikan catatan resolusi saat penutupan.

Acceptance Criteria

- Transisi status tidak menggunakan “dalam_perbaikan” sebagai status laporan.
### FR-14 — Perubahan Kondisi Fasilitas

Petugas dapat menandai fasilitas dalam_perbaikan berdasarkan laporan yang ditangani dan mengembalikannya ke aktif setelah selesai. Jika yang dalam_perbaikan adalah ruangan, seluruh alat di dalamnya tidak reservable; jika hanya alat yang dalam_perbaikan, ruangan induk tetap boleh direservasi dan Petugas dapat menginformasikan kondisi alat kepada pengaju secara langsung.

Acceptance Criteria

- Fasilitas yang dirinya dalam_perbaikan tidak dapat dipesan. Status dalam_perbaikan pada alat tidak otomatis membuat ruangan induk tidak reservable; status dalam_perbaikan pada ruangan membuat seluruh child tools tidak reservable.
## 6.4 Admin

### FR-15 — Pembuatan Akun Petugas

Admin dapat membuat akun Petugas secara langsung.

Perilaku/Aturan

- Petugas tidak memiliki self-registration.
Acceptance Criteria

- Akun Petugas yang dibuat Admin dapat login sesuai kredensial.
### FR-16 — Pembuatan Akun Pengguna oleh Admin

Admin dapat membuat akun Pengguna secara langsung tanpa melalui registrasi mandiri.

Acceptance Criteria

- Akun yang dibuat Admin tercatat sebagai akun Pengguna.
### FR-17 — Verifikasi Akun Pengguna

Admin melihat akun hasil registrasi mandiri yang menunggu verifikasi dan dapat approve atau reject.

Perilaku/Aturan

- Registrasi mandiri Pengguna merupakan alur yang tersedia.
- Akun pending/rejected tidak boleh login.
- Akun approved dapat login.
Acceptance Criteria

- Approval mengaktifkan kemampuan login.
- Rejection mempertahankan akun tidak dapat login.
- US-15 tetap menjadi sumber requirement ini.
### FR-18 — Pengelolaan Fasilitas

Admin dapat menambah, melihat, mengubah, dan menonaktifkan fasilitas.

Perilaku/Aturan

- Tidak menggunakan hard delete untuk sekadar menonaktifkan fasilitas.
- Ketika Admin menonaktifkan fasilitas, sistem langsung menolak seluruh reservasi menunggu dan membatalkan seluruh reservasi disetujui yang belum selesai pada fasilitas tersebut.
- Penonaktifan Admin tidak membutuhkan alasan Petugas dan tidak menghasilkan pesan pembatalan khusus; status akhir tetap terlihat pada riwayat pengguna.

Acceptance Criteria

- Fasilitas nonaktif tidak tersedia untuk reservasi baru.
### FR-19 — Rekap dan Export

Admin dapat melihat rekap okupansi dan frekuensi kerusakan per fasilitas/lokasi dan mengekspornya ke CSV/Excel/PDF.

Acceptance Criteria

- Rekap dapat difilter sesuai data yang tersedia.
- Export menghasilkan format yang dipilih atau error yang informatif.
# 7. Validasi dan Penanganan Kasus Tepi

## 7.1 Authentication & Verifikasi Akun

- Email registrasi sudah terdaftar → tolak dengan validation error.
- Email/password tidak valid → tolak dengan pesan yang tidak membocorkan detail sensitif.
- Akun pending mencoba login → tolak dan jelaskan bahwa akun menunggu verifikasi Admin.
- Akun rejected mencoba login → tolak; pesan harus jelas bahwa akun belum dapat digunakan.
- Admin memproses akun yang sudah approved/rejected → cegah state transition yang tidak valid.
- Sistem hanya memiliki satu akun dengan role Admin; skenario dua Admin memproses verifikasi yang sama tidak berlaku pada baseline AduPDF.
- Pengguna mencoba registrasi ulang dengan email pending/rejected → email tetap dianggap sudah terdaftar kecuali ada kebijakan lain yang disetujui.
## 7.2 Reservasi

- start_time >= end_time → tolak.
- Waktu sebelum 07:00 atau sesudah 20:00 → tolak.
- Waktu bukan kelipatan 30 menit → tolak.
- Fasilitas tidak ditemukan → not found.
- Fasilitas target yang dalam_perbaikan/nonaktif → tolak. Jika parent ruangan dalam_perbaikan/nonaktif, reservasi child alat ditolak. Jika hanya child alat dalam_perbaikan, full-room reservation tetap dapat diajukan dengan alat tersebut tetap tidak dapat digunakan.
- Availability berubah setelah halaman dibuka → server harus memvalidasi ulang saat submit/approve.
- Dua atau lebih pengajuan yang saling konflik dapat sama-sama menunggu. Petugas menentukan pengajuan yang disetujui; setelah approval, pengajuan menunggu lain yang konflik otomatis ditolak.
- Pengguna mencoba membatalkan reservasi milik orang lain → forbidden/not found sesuai kebijakan.
- Pembatalan setelah deadline → tolak.
- Petugas cancel tanpa alasan → validation error.
- Full-room reservation dicoba ketika satu atau lebih alat di dalam ruangan sudah disetujui pada slot overlap → tolak, termasuk jika alat tersebut dipesan oleh Pengguna yang sama.
- Alat dicoba direservasi ketika ruangan induk sudah reserved penuh pada slot overlap → tolak untuk semua Pengguna.
- Dua alat berbeda dalam ruangan yang sama dapat disetujui untuk Pengguna berbeda pada waktu overlap selama ruangan tidak direservasi penuh, parent room dapat digunakan, dan masing-masing alat tersedia.
- Pengguna tidak boleh memiliki reservasi overlap lintas ruangan. Jika sudah memiliki reservasi alat/ruangan di Ruang A, reservasi pada Ruang B untuk waktu overlap harus ditolak.
- Pengguna yang sudah memiliki reservasi alat pada Ruang A boleh menambah alat lain yang tersedia di Ruang A pada waktu overlap, tetapi tidak boleh mengajukan full-room Ruang A maupun fasilitas pada ruangan lain untuk waktu overlap.
- Pembatalan Pengguna dilakukan kurang dari 48 jam sebelum start_time → tolak.

## 7.3 Laporan Kerusakan

- Facility ID tidak valid → not found.
- Kategori/deskripsi kosong → validation error.
- Tidak ada foto pendukung → validation error karena FR-07 menetapkan foto sebagai input minimal.
- Foto bukan tipe image yang diperbolehkan → tolak upload.
- Satu file > 2 MB → tolak dengan pesan informatif.
- Jumlah lampiran > 8 file → tolak request.
- Format selain JPG/JPEG/PNG → tolak upload.

- Petugas mencoba transisi status yang tidak diizinkan → tolak.
- Laporan selesai dicoba diproses ulang → tolak atau butuh reopen policy (tidak termasuk scope saat ini).
## 7.4 Fasilitas

- Kapasitas negatif → validation error.
- Nama/tipe/lokasi wajib sesuai field yang ditetapkan.
- Admin mencoba hard delete fasilitas berhistori → jangan hapus; gunakan nonaktif.
- Admin menonaktifkan fasilitas dengan reservasi menunggu/disetujui yang belum selesai → sistem otomatis mengubah menunggu→ditolak dan disetujui→dibatalkan; tidak memerlukan alasan Petugas.
- Fasilitas bertipe Alat tidak memiliki ruangan induk yang valid → validation error pada data master.
- Lapangan ditetapkan memiliki child Alat → tolak karena domain rule menyatakan lapangan tidak memiliki alat. Jika ruangan menjadi dalam_perbaikan/nonaktif, child tools tidak reservable tanpa harus mengubah status masing-masing tool; jika hanya tool dalam_perbaikan, parent room tetap dapat direservasi.

## 7.5 Export

- Rekap kosong → export tetap harus menghasilkan output yang jelas atau pesan “tidak ada data”.
- Format export tidak didukung → validation error.
- Kegagalan generate file → tampilkan error tanpa membuat data sistem berubah.
# 8. UX Needs dan Struktur Halaman

## 8.1 UX Needs

- Navigasi menyesuaikan role dan tidak menampilkan aksi yang tidak berhak digunakan.
- Status reservasi, laporan, dan fasilitas harus mudah dibedakan secara visual tanpa hanya mengandalkan warna.
- Aksi destruktif/berdampak besar seperti cancel, reject, dan nonaktifkan membutuhkan confirmation. Untuk nonaktifkan fasilitas, konfirmasi Admin harus menjelaskan bahwa seluruh reservasi menunggu/disetujui yang belum selesai akan diputus otomatis.
- Pengguna tidak menerima pesan pembatalan khusus akibat penonaktifan fasilitas oleh Admin; namun status reservasi yang berubah tetap ditampilkan pada riwayat/detail.
- UI pemilihan fasilitas harus menampilkan konteks ruangan–alat: tool reservation dapat berbagi ruangan dengan tool lain, tetapi membuat full-room reservation unavailable pada slot overlap; full-room reservation membuat seluruh tool unavailable. Jika suatu tool sedang dalam_perbaikan tetapi room tetap reservable, kondisi tool harus terlihat dan dapat diperkuat melalui konfirmasi langsung Petugas.

- Setelah submit/approval/rejection, sistem memberikan feedback sukses/gagal yang jelas.
- Validation message muncul dekat field terkait dan tetap divalidasi server-side.
- Semua halaman menyediakan loading, empty, error, dan success state yang relevan.
- Desain responsif pada desktop dan mobile browser.
- Primary color #2D4C79 digunakan konsisten dengan kontras teks yang memadai.
- Setelah registrasi, Pengguna diberi pesan bahwa akun menunggu verifikasi Admin dan belum dapat login.
## 8.2 Struktur Halaman Guest

```text
Home
Facilities
 └── Facility Detail
      └── Availability
Login
Register
```

## 8.3 Struktur Halaman Pengguna

```text
Dashboard
Facilities
 └── Facility Detail
      └── Create Reservation
My Reservations
 └── Reservation Detail
My Reports
 ├── Create Report
 └── Report Detail
Profile
Logout
```

## 8.4 Struktur Halaman Petugas

```text
Petugas Dashboard
 ├── Reservation Queue
 │    └── Reservation Detail
 ├── Report Queue
 │    └── Report Detail
 └── Facility Condition
```

## 8.5 Struktur Halaman Admin

```text
Admin Dashboard
 ├── Account Management
 │    ├── Verification Queue
 │    ├── Create Petugas
 │    └── Create Pengguna
 ├── Facility Management
 │    ├── Facility List
 │    ├── Create Facility
 │    └── Edit / Deactivate
 └── Recap
      ├── Occupancy
      ├── Damage Frequency
      └── Export
```

# 9. Non-Functional Requirements

| ID | Kategori | Requirement |
| --- | --- | --- |
| NFR-01 | Arsitektur Kode | Aplikasi menggunakan Laravel dengan Blade dan memisahkan koneksi/akses data (Model), request handling (Controller), logika proses, konfigurasi, serta View secara logis sesuai struktur framework. |
| NFR-02 | Keamanan & Validasi | Form penting wajib divalidasi client-side dan server-side. Password disimpan dalam bentuk hash yang aman. Otorisasi role dan ownership diterapkan untuk resource terproteksi. |
| NFR-03 | Version Control & Kolaborasi | Source code dikelola pada repository bersama GitHub/GitLab; seluruh anggota wajib berkontribusi dan menggunakan pesan commit yang representatif. |
| NFR-04 | Usability & UI/UX | UI harus user-friendly, intuitif, responsif, konsisten, menggunakan #2D4C79 sebagai primary color, serta menjaga keterbacaan dan kontras. |

Catatan: Target kuantitatif seperti response time <500 ms, uptime 99.9%, atau jumlah concurrent user tidak ditambahkan karena tidak dinyatakan pada sumber proyek. Jika dibutuhkan, target tersebut harus ditetapkan sebagai requirement baru yang terukur.

# 10. Risiko dan Mitigasi

| ID | Risiko | Level | Dampak | Mitigasi |
| --- | --- | --- | --- | --- |
| R-01 | Double booking akibat concurrency | Tinggi | Dua atau lebih reservasi disetujui yang melanggar konflik resource/personal. | Validasi konflik server-side saat approval, transaction, state terbaru, dan auto-reject pending requests yang menjadi konflik setelah satu approval. |
| R-02 | Bypass validasi waktu di client | Tinggi | Reservasi melanggar jam operasional/slot. | Validasi BR-01/BR-02 di server untuk semua request. |
| R-03 | Unauthorized access | Tinggi | User mengakses data role atau pemilik lain. | Middleware RBAC + Policy/Gate/ownership check. |
| R-04 | Akun tidak sah | Tinggi | Akun Pengguna belum disetujui atau Petugas dibuat di luar alur. | Verification queue Admin; Petugas hanya dibuat Admin; blok login pending/rejected. |
| R-05 | Kebocoran informasi reservasi | Tinggi | Guest melihat nama/tujuan pemesan. | Pisahkan response/view publik dari data reservasi internal. |
| R-06 | Upload file berbahaya | Sedang | Security/storage issue dari foto laporan. | Maksimal 8 file, masing-masing 2 MB; hanya JPG/JPEG/PNG; validasi MIME/type, nama file aman, dan storage non-executable. |
| R-07 | Hard delete fasilitas | Tinggi | Histori reservasi/laporan kehilangan referensi. | Gunakan status nonaktif, bukan delete untuk deactivation. |
| R-08 | Inkonsistensi status laporan/fasilitas | Sedang | Laporan selesai tetapi fasilitas tetap dalam_perbaikan atau sebaliknya. | Service/transaction terpusat untuk update terkait dan validasi transisi. |
| R-09 | Export berat | Sedang | Timeout/memory tinggi. | Query efisien, filter periode bila dibutuhkan, streaming/chunking jika implementasi memerlukan. |
| R-10 | Requirement drift atau interpretasi berbeda | Tinggi | Anggota tim menerapkan rule yang tidak konsisten meski OD utama sudah ditutup. | Gunakan SRS final, traceability, dan change control; perubahan rule harus disetujui sebelum coding. |
| R-11 | Inkonsistensi availability ruangan–alat | Tinggi | Ruangan atau alat dapat double-book akibat validasi hanya memeriksa facility_id langsung. | Gunakan validasi hierarki asimetris: room→all tools; tool→self + blocks full-room; sibling tools tetap dapat coexist. Validasi ulang saat approval. |
| R-12 | Penonaktifan fasilitas memutus banyak reservasi | Tinggi | Perubahan massal status dapat tidak konsisten jika proses gagal sebagian. | Lakukan perubahan fasilitas dan seluruh reservation transition terkait dalam database transaction/operasi atomik. |
| R-13 | Multi-file upload berlebihan/berbahaya | Sedang | Penyimpanan membengkak atau file tidak aman. | Batasi maksimal 8 file × 2 MB, hanya JPG/JPEG/PNG, validasi MIME, dan simpan pada storage non-executable. |
| R-14 | Kondisi tool rusak tidak terlihat pada reservasi room | Sedang | Pengguna memesan ruangan dengan asumsi semua alat siap pakai. | Tampilkan kondisi tool pada detail room dan availability; Petugas dapat mengonfirmasi langsung alat yang sedang dalam_perbaikan. |

# 11. Traceability User Story

| User Story | FR | Aktor | Domain | BR terkait |
| --- | --- | --- | --- | --- |
| US-01 | FR-01, FR-02 | Guest | Facility Discovery | BR-04, BR-08 |
| US-02 | FR-03 | Guest | Facility Discovery | — |
| US-03 | FR-04 | Pengguna | Reservation | BR-01, BR-02, BR-03, BR-10, BR-15, BR-16, BR-17, BR-20 |
| US-04 | FR-05 | Pengguna | Reservation | BR-11 |
| US-05 | FR-06 | Pengguna | Reservation | Ownership |
| US-06 | FR-07 | Pengguna | Report | NFR-02, BR-19 |
| US-07 | FR-08 | Pengguna | Report | Ownership, BR-13 |
| US-08 | FR-09 | Petugas | Operations Dashboard | BR-13 |
| US-09 | FR-10, FR-11 | Petugas | Reservation Approval | BR-03, BR-09, BR-15, BR-16, BR-17, BR-20 |
| US-10 | FR-12 | Petugas | Reservation Cancellation | BR-12 |
| US-11 | FR-13 | Petugas | Report Handling | BR-13 |
| US-12 | FR-14 | Petugas | Facility Condition | BR-10 |
| US-13 | FR-15 | Admin | Account Management | BR-07, BR-18 |
| US-14 | FR-16 | Admin | Account Management | — |
| US-15 | FR-17 | Admin | Account Verification | BR-05, BR-06 |
| US-16 | FR-18 | Admin | Facility Management | BR-14, BR-18 |
| US-17 | FR-19 | Admin | Analytics/Export | BR-21 |

US-15 tetap menjadi sumber untuk approval/verifikasi akun hasil registrasi mandiri. Perubahan terbaru hanya menghilangkan sifat opsionalnya: self-registration Pengguna sekarang menjadi alur yang digunakan, tetapi akun tidak dapat login sebelum approved oleh Admin.

# 12. Technical Design Overview

Bagian ini ditempatkan setelah requirement inti agar desain teknis tidak mengunci solusi sebelum kebutuhan bisnis, RBAC, flow, validasi, dan edge case didefinisikan.

## 12.1 Technology Stack

- Backend / application framework: Laravel.
- Frontend / server-rendered UI: Blade.
- Database: relasional (mengikuti implementasi tim; rancangan awal menggunakan tabel Users, Facilities, Reservations, Reports).
- Version control: GitHub atau GitLab repository bersama.
## 12.2 Rancangan Database Rekomendasi

Empat tabel inti berasal dari hint rancangan database proyek. Atribut tambahan di bawah mendukung requirement yang telah didefinisikan. Untuk verifikasi akun, status tiga nilai direkomendasikan karena boolean tidak dapat membedakan pending dan rejected.

### users

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID |
| nama | VARCHAR(100) | Nama lengkap |
| email | VARCHAR(100) UNIQUE | Email login |
| password | VARCHAR(255) | Password hash |
| role | ENUM | pengguna/petugas/admin |
| verification_status | ENUM | pending/approved/rejected untuk Pengguna; akun Petugas dibuat Admin |

### facilities

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID |
| nama_fasilitas | VARCHAR(100) | Nama fasilitas |
| tipe | VARCHAR(50) | Kelas/Aula/Lab/Alat/Lapangan |
| lokasi | VARCHAR(100) | Gedung/Lantai/Lokasi |
| kapasitas | INT | >= 0 |
| deskripsi | TEXT | Deskripsi |
| status_kondisi | ENUM | aktif/dalam_perbaikan/nonaktif. Status parent room memengaruhi reservability child tools; status tool tidak otomatis mengubah status parent room. |
| parent_facility_id | BIGINT FK, wajib untuk tipe Alat | Ruangan induk alat. Lapangan tidak dapat menjadi parent; tool harus terkait ke satu ruang kelas/aula/lab. |

### reservations

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID |
| user_id | BIGINT FK | Pemesan |
| facility_id | BIGINT FK | Fasilitas |
| tujuan | TEXT | Tujuan penggunaan |
| start_time | DATETIME | Mulai |
| end_time | DATETIME | Selesai |
| status | ENUM | menunggu/disetujui/ditolak/dibatalkan |
| alasan_pembatalan | TEXT NULL | Alasan cancel darurat Petugas |

### reports

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID |
| user_id | BIGINT FK | Pelapor |
| facility_id | BIGINT FK | Fasilitas |
| kategori | VARCHAR(100) | Kategori kerusakan |
| deskripsi | TEXT | Rincian |
| status_laporan | ENUM | baru/diproses/selesai/ditolak |
| catatan_resolusi | TEXT NULL | Catatan penutupan |

### report_attachments

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID lampiran |
| report_id | BIGINT FK | Relasi ke reports.id |
| file_path | VARCHAR(255) | Path file pada storage |
| original_name | VARCHAR(255) | Nama file asli untuk display/audit |
| mime_type | VARCHAR(100) | Harus image/jpeg atau image/png sesuai validasi |
| file_size | INT | Ukuran byte; maksimum 2 MB per file |

> Perubahan desain akun: Draft awal memakai is_verified BOOLEAN. Untuk flow mandatory approve/reject, verification_status pending/approved/rejected direkomendasikan agar status “menunggu” dan “ditolak” tidak tercampur. Ini adalah keputusan desain yang mendukung US-15, bukan penambahan user story.

## 12.3 Relasi Data

```text
Users 1 ─── N Reservations N ─── 1 Facilities
Users 1 ─── N Reports      N ─── 1 Facilities
Reports 1 ─── N Report_Attachments
Facilities (Ruangan) 1 ─── N Facilities (Alat) melalui parent_facility_id
```

## 12.4 Logika Ketersediaan

```text
CHECK TARGET + USER CONTEXT

IF target = RUANGAN:
    IF room.status_kondisi != aktif → tidak tersedia
    ELSE IF ada approved reservation langsung pada room yang overlap → tidak tersedia
    ELSE IF ada approved reservation pada salah satu child tool yang overlap → tidak tersedia untuk full-room reservation
    ELSE IF Pengguna punya approved reservation overlap pada ruangan lain → tidak tersedia bagi Pengguna tersebut
    ELSE → tersedia

IF target = ALAT:
    IF tool.status_kondisi != aktif → tidak tersedia
    ELSE IF parent room.status_kondisi != aktif → tidak tersedia
    ELSE IF ada approved reservation langsung pada tool yang overlap → tidak tersedia
    ELSE IF ada approved full-room reservation pada parent yang overlap → tidak tersedia
    ELSE IF Pengguna punya approved reservation overlap pada ruangan lain → tidak tersedia bagi Pengguna tersebut
    ELSE → tersedia

CATATAN:
- Approved sibling tool reservations tidak memblokir tool lain di room yang sama.
- Pending requests boleh coexist; Petugas menentukan approval.
- Setelah satu request approved, pending requests yang menjadi konflik otomatis ditolak.
```

Ketersediaan dihitung dari status kondisi, reservasi approved, relasi parent-child ruangan–alat, dan overlap personal Pengguna. Konflik room–tool bersifat asimetris. Reservasi penuh ruangan memblokir seluruh child tools; reservasi tool memblokir tool tersebut dan full-room reservation tetapi tidak sibling tools. Reservasi penuh ruangan dihitung sebagai usage ruangan saja, sedangkan usage individual tool berasal dari reservasi tool eksplisit.

## 12.5 Route & Interaction Specification (Laravel + Blade)

Karena stack menggunakan Laravel full-stack + Blade, dokumen menggunakan spesifikasi route/interaksi, bukan memaksakan arsitektur REST API terpisah yang tidak diwajibkan proyek.

| Method | Route | Aktor | Fungsi |
| --- | --- | --- | --- |
| GET | /register | Guest | Form registrasi Pengguna |
| POST | /register | Guest | Submit registrasi → pending |
| GET | /login | Guest | Form login |
| POST | /login | Guest | Login; blok jika belum approved |
| POST | /logout | Authenticated | Logout |
| GET | /facilities | Semua | Daftar/search/filter fasilitas |
| GET | /facilities/{facility} | Semua | Detail dan availability publik |
| GET | /reservations | Pengguna | Riwayat sendiri |
| GET | /reservations/create | Pengguna | Form reservasi |
| POST | /reservations | Pengguna | Buat reservasi |
| GET | /reservations/{reservation} | Pengguna | Detail sendiri |
| PATCH | /reservations/{reservation}/cancel | Pengguna | Cancel sendiri |
| GET | /reports | Pengguna | Laporan sendiri |
| GET | /reports/create | Pengguna | Form laporan |
| POST | /reports | Pengguna | Buat laporan + unggah maksimal 8 foto JPG/JPEG/PNG @ 2 MB |
| GET | /reports/{report} | Pengguna | Detail/status sendiri |
| GET | /petugas/dashboard | Petugas | Antrian |
| PATCH | /petugas/reservations/{reservation}/approve | Petugas | Approve + validasi konflik terbaru + auto-reject pending requests yang kini konflik |
| PATCH | /petugas/reservations/{reservation}/reject | Petugas | Reject |
| PATCH | /petugas/reservations/{reservation}/cancel | Petugas | Cancel darurat |
| PATCH | /petugas/reports/{report}/status | Petugas | Update laporan |
| PATCH | /petugas/facilities/{facility}/condition | Petugas | Update kondisi fasilitas |
| GET | /admin/verifications | Admin | Verification queue |
| PATCH | /admin/users/{user}/verify | Admin | Approve akun Pengguna |
| PATCH | /admin/users/{user}/reject | Admin | Reject akun Pengguna |
| GET | /admin/users/petugas/create | Admin | Form Petugas |
| POST | /admin/users/petugas | Admin | Create Petugas |
| GET | /admin/users/pengguna/create | Admin | Form Pengguna |
| POST | /admin/users/pengguna | Admin | Create Pengguna |
| GET | /admin/facilities | Admin | Kelola fasilitas |
| POST | /admin/facilities | Admin | Tambah fasilitas |
| PATCH | /admin/facilities/{facility} | Admin | Update fasilitas |
| PATCH | /admin/facilities/{facility}/deactivate | Admin | Nonaktifkan absolut; pending→ditolak dan approved→dibatalkan otomatis |
| GET | /admin/recap | Admin | Rekap |
| GET | /admin/recap/export | Admin | Export |

# 13. Ringkasan Perubahan dan Alasan

| Perubahan | Alasan |
| --- | --- |
| FR menjadi 19 | Sumber tetap 17 User Story, tetapi US-01 dan US-09 mengandung lebih dari satu perilaku sehingga dipecah menjadi requirement atomik yang dapat diuji. |
| Registrasi mandiri Pengguna menjadi mandatory | Keputusan terbaru: Pengguna boleh membuat akun sendiri tetapi harus approved Admin sebelum login; tetap ditelusurkan ke US-15. |
| Verification status direkomendasikan pending/approved/rejected | Boolean is_verified tidak membedakan akun menunggu dan ditolak. |
| Petugas tidak self-register | User Story 13 menyatakan akun Petugas dibuat Admin. |
| Status laporan tidak memiliki “dalam_perbaikan” | “dalam_perbaikan” adalah kondisi fasilitas; status laporan mengikuti baru/diproses/selesai/ditolak. |
| Dashboard Petugas memakai reservasi menunggu + laporan baru | Menyelaraskan state awal masing-masing domain. |
| CRUD fasilitas diganti tambah/lihat/ubah/nonaktifkan | User Story meminta nonaktifkan, bukan hard delete; histori perlu tetap utuh. |
| Availability dihitung, tidak disimpan statis | Mencegah data ketersediaan tidak sinkron dengan status fasilitas/reservasi approved. |
| API Specification diganti Route & Interaction Specification | Laravel + Blade tidak memerlukan frontend-backend terpisah melalui REST API kecuali ada kebutuhan khusus. |
| Edge cases dan Risiko ditambahkan | Mencegah requirement hanya menjelaskan happy path, terutama concurrency, otorisasi, dan state transition. |
| Technical Design ditempatkan setelah SRS inti | Requirement dikunci lebih dulu sebelum solusi teknis agar desain tidak mendikte kebutuhan. |
| Relasi ruangan–alat ditambahkan | Keputusan final: alat berada pada satu ruangan; reservasi alat dan ruangan saling memengaruhi availability. Lapangan tidak memiliki alat. |
| Deadline pembatalan dikunci H-2 | H-2 didefinisikan sebagai tepat 48 jam sebelum start_time agar validasi server deterministik. |
| Aturan overlap per Pengguna ditambahkan | Pengguna boleh mengajukan banyak ruangan tetapi tidak boleh memiliki approved room reservation yang overlap; reservasi alat overlap lintas ruangan dibatasi. |
| Admin tunggal diprovision developer | Keputusan final: hanya ada satu Admin; tidak ada create-admin; Admin dapat mengganti password sendiri. |
| Penonaktifan Admin dibuat absolut | Fasilitas nonaktif langsung memutus semua reservasi belum selesai: pending→ditolak dan approved→dibatalkan tanpa intervensi/alasan Petugas. |
| Foto laporan menjadi multi-file | Maksimal 8 foto × 2 MB, JPG/JPEG/PNG; database dinormalisasi dengan tabel report_attachments. |
| Konflik ruangan–alat dipertegas asimetris | Room reservation memblokir semua child tools; tool reservation hanya memblokir tool tersebut dan full-room reservation, sementara sibling tools tetap dapat coexist. |
| Pending conflict diputus Petugas | Pengajuan konflik dapat sama-sama menunggu. Approval Petugas menentukan pemenang; pending lain yang menjadi konflik otomatis ditolak. |
| Overlap Pengguna dilarang lintas ruangan | Dalam slot overlap, Pengguna hanya dapat menambah tool pada room yang sama; full-room dan fasilitas room lain ditolak. |
| Perbaikan tool tidak memblokir room | Tool dalam_perbaikan tetap unusable, tetapi room dapat direservasi; room dalam_perbaikan/nonaktif memblokir seluruh child tools. |
| Rekap room–tool dikunci | Full-room reservation dihitung sebagai penggunaan room saja; usage individual tool hanya dari explicit tool reservation. |

# 14. Status Keputusan / Open Decisions

Tidak ada Open Decision aktif pada versi ini. Seluruh keputusan utama yang dibahas telah dikunci: registrasi dan approval akun, deadline pembatalan H-2, provisioning Admin tunggal, relasi ruangan–alat, konflik pending/approval, overlap personal, propagasi kondisi fasilitas, penonaktifan absolut oleh Admin, upload 8 × 2 MB JPG/JPEG/PNG, serta definisi rekap penggunaan room–tool. Perubahan berikutnya harus diperlakukan sebagai change request terhadap baseline ini.

| ID | Keputusan | Catatan |
| --- | --- | --- |
| STATUS | Tidak ada OD aktif | Semua keputusan yang sebelumnya terbuka telah ditutup. Gunakan dokumen ini sebagai baseline requirement; perubahan baru memerlukan persetujuan/change request. |
