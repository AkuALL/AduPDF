AduPDF

Sistem Reservasi & Pelaporan Fasilitas Kampus

SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

Dokumen konsolidasi V1–V2 dengan baseline aturan Iterasi 2
Tech Stack: Laravel 13 + Inertia.js 3 + React 19 + TypeScript + Tailwind CSS v4

Primary UI Color: #2D4C79

> Status dokumen: Diselaraskan dengan implementasi kode yang diperiksa pada 09 Oktober 2026. Kesenjangan implementasi dan cakupan yang belum diputuskan dicatat pada Bagian 14.

# Dasar Penyusunan

Dokumen ini disusun berdasarkan spesifikasi proyek PPK 2026, draft SRS AduPDF sebelumnya, serta keputusan yang telah disepakati dalam diskusi revisi. Terminologi dan kebutuhan utama mengikuti sumber proyek; keputusan tambahan yang belum ditentukan sumber ditandai sebagai TBD/Open Decision dan tidak diasumsikan secara diam-diam.

- DetailProyekPPK2026.pdf — ketentuan umum, 17 User Story, aturan waktu reservasi, aktor, dan hint rancangan database.
- DRAFT_AduPDF.pdf — draft kebutuhan fungsional, non-fungsional, business rules, dan rancangan database awal.
- Keputusan Iterasi 2 — Laravel + Inertia.js React + TypeScript, warna utama #2D4C79, terminologi Pengunjung, registrasi mandiri yang menunggu persetujuan Admin tanpa verifikasi email, profil dengan NIM/NIP/No. Pegawai dan WhatsApp, identitas wajib sebelum reservasi, horizon reservasi 90 hari, auto-reject pending dengan alasan kedaluwarsa, antrian Petugas bersegmen slot, serta penonaktifan akun yang dapat dipulihkan Admin. Saat akun dinonaktifkan, reservasi menunggu yang belum selesai ditolak dan reservasi disetujui yang belum selesai dibatalkan dengan alasan penonaktifan akun.
# 1. Pendahuluan dan Ruang Lingkup

## 1.1 Tujuan Dokumen

Software Requirements Specification (SRS)
AduPDF: Sistem Reservasi & Pelaporan Fasilitas Kampus

## 1.2 Gambaran Umum Sistem

AduPDF adalah aplikasi web terpusat untuk membantu pengelolaan penggunaan fasilitas kampus. Sistem mendukung pengecekan fasilitas dan ketersediaan slot, reservasi, persetujuan/penolakan reservasi, pelaporan kerusakan, penanganan laporan, perubahan kondisi fasilitas, pengelolaan akun dan master fasilitas, serta rekapitulasi penggunaan dan kerusakan.

## 1.3 In Scope

- Daftar fasilitas dan ketersediaan per slot waktu untuk Pengunjung dan Pengguna.
- Pencarian dan filter berdasarkan tipe, lokasi, dan kapasitas.
- Registrasi mandiri Pengguna, persetujuan Admin sebelum akun dapat login, dan pengelolaan profil.
- Pengaturan kata sandi untuk akun terautentikasi dan preferensi tampilan aplikasi.
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
- Pemulihan kata sandi mandiri, autentikasi dua faktor, dan pengelolaan passkey sebagai use case pengguna.
- Perubahan kata sandi melalui form profil; perubahan kata sandi yang masuk scope dilakukan melalui pengaturan keamanan atau halaman Admin.
- Fitur bisnis di luar 17 User Story sumber dan keputusan yang ditetapkan pada SRS ini tanpa persetujuan perubahan ruang lingkup.

# 2. Terminologi dan Definisi

| Istilah | Definisi |
| --- | --- |
| Pengunjung | Pengakses yang belum login dan hanya dapat menggunakan informasi publik. |
| Pengguna | Mahasiswa, dosen, atau staf yang akunnya telah disetujui dan tidak dinonaktifkan. |
| Petugas | Aktor yang memproses reservasi dan laporan kerusakan serta memperbarui kondisi fasilitas. Akunnya dibuat Admin. |
| Admin | Aktor yang mengelola akun, data fasilitas, serta rekapitulasi. |
| Fasilitas | Objek kampus yang dikelola sistem: ruang kelas, aula, laboratorium, alat, atau lapangan. |
| Reservasi | Pengajuan penggunaan satu fasilitas pada rentang waktu tertentu. |
| Slot Waktu | Unit waktu reservasi berdurasi 30 menit. |
| Bentrok Reservasi | Kondisi dua reservasi pada fasilitas sama memiliki interval waktu yang overlap. |
| Status Reservasi | menunggu, disetujui, ditolak, dibatalkan. Pengajuan menunggu yang belum diproses hingga waktu mulai ditolak oleh tugas scheduler pada eksekusi pertama setelah waktu tersebut, dengan alasan kedaluwarsa. |
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

Pengguna: Mahasiswa/Dosen/Staf dengan akun aktif.

Petugas: Memproses reservasi, laporan, dan kondisi fasilitas.

Admin: Mengelola akun, fasilitas, dan rekap.

## 3.2 Matriks RBAC

| Aksi | Pengunjung | Pengguna | Petugas | Admin |
| --- | --- | --- | --- | --- |
| Melihat daftar fasilitas publik | ✓ | ✓ | ✗ | ✗ |
| Melihat ketersediaan publik | ✓ | ✓ | ✗ | ✗ |
| Search/filter daftar fasilitas publik | ✓ | ✓ | ✗ | ✗ |
| Registrasi mandiri Pengguna | ✓ | — | ✗ | ✗ |
| Login/logout | — | ✓ | ✓ | ✓ |
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
| Menonaktifkan/mengaktifkan kembali akun role apa pun | ✗ | ✗ | ✗ | ✓ |
| Kelola fasilitas | ✗ | ✗ | ✗ | ✓ |
| Lihat/export rekap | ✗ | ✗ | ✗ | ✓ |

Keterangan: Akun hasil registrasi mandiri baru dapat login setelah disetujui Admin; akun yang dibuat langsung oleh Admin sudah disetujui saat dibuat. Admin dan Petugas diarahkan ke dashboard masing-masing jika membuka halaman daftar/detail fasilitas. Tanda “—” berarti aksi tersebut bukan aksi utama role tersebut atau tidak relevan.

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
| BR-04 | Akses Fasilitas Publik | Pengunjung dapat melihat fasilitas, ketersediaan, dan melakukan search/filter tanpa login; Pengguna juga dapat mengakses halaman fasilitas publik. Admin dan Petugas tidak dapat membuka halaman fasilitas publik; Admin tetap memiliki modul pengelolaan fasilitas tersendiri. |
| BR-05 | Registrasi Pengguna | Mahasiswa/Dosen/Staf dapat membuat akun secara mandiri; akun baru menunggu persetujuan Admin sebelum dapat login. |
| BR-06 | Persetujuan Registrasi Mandiri | Akun Pengguna hasil registrasi mandiri berstatus menunggu persetujuan dan tidak dapat login sampai Admin menyetujuinya. Persetujuan Admin adalah satu-satunya verifikasi akun; verifikasi email tidak diperlukan. Akun yang dibuat langsung oleh Admin sudah disetujui saat dibuat. |
| BR-07 | Akun Petugas | Petugas tidak melakukan registrasi mandiri; akun Petugas dibuat langsung oleh Admin. |
| BR-08 | Privasi Jadwal | Pengunjung hanya melihat status tersedia/tidak tersedia dan tidak boleh melihat identitas pemesan atau tujuan reservasi. |
| BR-09 | Anti-Bentrok & Konflik | Approval reservasi wajib mempertimbangkan konflik langsung pada fasilitas, relasi ruangan–alat, serta overlap reservasi milik Pengguna. Sistem tidak boleh menghasilkan kombinasi reservasi disetujui yang melanggar aturan tersebut. |
| BR-10 | Kondisi Fasilitas | Fasilitas yang dirinya berstatus dalam_perbaikan atau nonaktif tidak dapat dipesan. Jika ruangan dalam_perbaikan/nonaktif, seluruh alat di dalamnya tidak reservable. Jika hanya satu alat dalam_perbaikan, alat tersebut tidak reservable tetapi ruangan induk tetap boleh diajukan untuk reservasi penuh; Petugas dapat menginformasikan kondisi alat secara langsung kepada pengaju. |
| BR-11 | Pembatalan Pengguna H-2 | Pengguna hanya boleh membatalkan reservasi miliknya paling lambat tepat 48 jam sebelum start_time. Setelah melewati batas tersebut, pembatalan oleh Pengguna ditolak. |
| BR-12 | Pembatalan Darurat | Petugas boleh membatalkan reservasi yang telah disetujui dalam kondisi darurat dan wajib mengisi alasan. |
| BR-13 | Status Laporan | Status laporan hanya: baru, diproses, selesai, ditolak. “dalam_perbaikan” adalah status kondisi fasilitas, bukan status laporan. |
| BR-14 | Penonaktifan dan Penghapusan Fasilitas | Admin dapat menonaktifkan fasilitas; jika fasilitas berupa ruangan, dampak reservasi juga mencakup semua alat turunannya. Reservasi menunggu yang belum selesai otomatis ditolak dan reservasi disetujui yang belum selesai dibatalkan. Tidak diperlukan tindakan/alasan Petugas dan tidak ada pesan pembatalan khusus; status akhir tetap terlihat di riwayat. Kode controller memblokir penghapusan permanen jika fasilitas memiliki reservasi atau alat turunan. Foreign key laporan juga mencegah penghapusan fasilitas yang masih direferensikan laporan, tetapi kode controller tidak menangani kondisi ini sebagai pesan validasi khusus. |
| BR-15 | Relasi Ruangan–Alat | Fasilitas bertipe alat wajib terkait ke satu ruangan induk. Ruangan yang dapat memiliki alat adalah ruang kelas, aula, dan laboratorium. Lapangan tidak memiliki alat. |
| BR-16 | Availability Ruangan–Alat | Jika ruangan direservasi penuh pada slot tertentu, seluruh alat di dalamnya menjadi tidak tersedia untuk reservasi terpisah pada slot overlap. Jika satu atau lebih alat dalam ruangan telah direservasi/disetujui, ruangan induknya tidak dapat direservasi penuh pada slot overlap, tetapi alat lain yang masih tersedia di ruangan tersebut tetap dapat dipesan oleh Pengguna lain. |
| BR-17 | Batas Overlap Pengguna | Reservasi berstatus menunggu boleh saling overlap sampai Petugas memutuskan approval. Saat pengajuan dan approval diperiksa terhadap reservasi disetujui milik Pengguna: Pengguna yang memiliki reservasi alat di Ruang A hanya boleh menambah reservasi alat lain yang tersedia di Ruang A pada waktu overlap; ia tidak boleh mengajukan reservasi penuh Ruang A pada waktu overlap atau reservasi pada ruangan lain. Di waktu yang tidak overlap, Pengguna boleh memesan fasilitas pada ruangan lain. |
| BR-18 | Provisioning Admin | Sistem hanya memiliki satu Admin. Akun Admin pertama dibuat/provision oleh developer, tidak melalui registrasi, dan Admin dapat mengganti password sendiri. Admin tidak dapat membuat akun Admin lain. |
| BR-19 | Upload Foto Laporan | Satu laporan dapat memiliki maksimal 8 foto. Setiap file maksimal 2 MB dan hanya format JPG, JPEG, atau PNG yang diperbolehkan. |
| BR-20 | Resolusi Pengajuan Konflik | Beberapa pengajuan yang saling konflik boleh sama-sama berstatus menunggu. Petugas menentukan pengajuan yang diprioritaskan untuk approval. Setelah satu pengajuan disetujui, seluruh pengajuan lain yang masih menunggu dan menjadi konflik terhadap reservasi tersebut otomatis berubah menjadi ditolak. |
| BR-21 | Rekap Penggunaan Ruangan–Alat | Reservasi penuh ruangan dihitung sebagai penggunaan ruangan. Alat di dalam ruangan menjadi unavailable selama reservasi penuh, tetapi tidak menambah frekuensi penggunaan individual alat. Frekuensi penggunaan individual alat hanya dihitung dari reservasi alat yang dilakukan secara eksplisit. |
| BR-22 | Identitas Sebelum Reservasi | Pengguna wajib memiliki salah satu identitas institusional (NIM, NIP, atau No. Pegawai) pada profil sebelum dapat mengajukan reservasi. Identitas tidak diinput ulang pada form reservasi. |
| BR-23 | Horizon Reservasi | Pengguna boleh mengajukan reservasi hingga `now + 90 hari`, tanpa minimum lead time; waktu mulai harus tetap lebih besar dari waktu saat pengajuan. |
| BR-24 | Penolakan Otomatis Pengajuan Kedaluwarsa | Aplikasi menjadwalkan perintah kedaluwarsa setiap menit. Jika Laravel scheduler berjalan, pada eksekusi pertama ketika `start_time` sudah tercapai, reservasi yang masih menunggu berubah menjadi `ditolak`, `alasan_penolakan` diisi bahwa pengajuan kedaluwarsa, dan `ditolak_pada` dicatat. Reservasi tersebut tidak menjadi occupancy. |
| BR-25 | Segmen Antrian Petugas | Queue reservasi Petugas dikelompokkan berdasarkan slot waktu. Segmen slot diurutkan dari yang paling dekat dengan waktu sekarang ke yang lebih jauh; di dalam setiap segmen, pengajuan diurutkan `created_at ASC`. |
| BR-26 | Penonaktifan Akun | Pengguna tidak dapat menonaktifkan akunnya sendiri. Admin dapat menonaktifkan akun role apa pun dan mengaktifkannya kembali; histori reservasi dan laporan tetap tersimpan. Akun nonaktif tidak dapat login atau membuat transaksi baru. Saat akun dinonaktifkan, reservasi menunggu yang belum selesai berubah menjadi ditolak dan `alasan_penolakan` menyatakan akun pemesan dinonaktifkan oleh Admin; reservasi disetujui yang belum selesai, termasuk yang sedang berlangsung, berubah menjadi dibatalkan dan `alasan_pembatalan` menyatakan hal yang sama. Waktu penolakan dicatat di `ditolak_pada`. Reservasi selesai dan reservasi berstatus terminal tidak berubah. Pengaktifan kembali hanya memulihkan akses dan tidak mengubah status reservasi. Admin terakhir tidak dapat dinonaktifkan. |

> Keputusan terkunci: deadline pembatalan Pengguna adalah H-2 (tepat 48 jam sebelum start_time); hanya satu Admin yang diprovision developer; Admin nonaktifkan fasilitas bersifat absolut; upload laporan maksimal 8 foto × 2 MB JPG/JPEG/PNG; relasi room–tool bersifat asimetris; pending conflict diputus Petugas dan pending lain yang konflik otomatis ditolak setelah approval; overlap Pengguna lintas ruangan dilarang; room reservation dihitung sebagai usage room, sedangkan usage tool hanya dari reservasi tool eksplisit.

# 5. Alur Utama per Domain

## 5.1 Authentication, Registration & Profile

```text
Pengunjung belum punya akun
        ↓
Registrasi mandiri
        ↓
Validasi data
        ↓
Akun dibuat: menunggu persetujuan Admin
        ↓
Admin menyetujui akun
        ↓
Login
        ↓
Lengkapi profil: NIM/NIP/No. Pegawai + WhatsApp
        ↓
Reservasi tersedia setelah identitas institusional terisi
```

Registrasi mandiri hanya memerlukan email, nama lengkap, dan password. Akun belum dapat digunakan untuk login sebelum disetujui Admin; tidak ada langkah verifikasi email. Akun yang dibuat langsung oleh Admin sudah disetujui saat dibuat. Setelah disetujui, Pengguna dapat membuat laporan; reservasi mensyaratkan identitas institusional pada profil.

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
Facility (beserta child tools jika berupa ruangan) → nonaktif → menunggu=ditolak otomatis; disetujui=dibatalkan otomatis → tanpa alasan Petugas / pesan pembatalan khusus
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
   ├── Account Management
   │      ├── Create Petugas
   │      ├── Create Pengguna
   │      └── Nonaktifkan / Aktifkan Kembali Akun
   ├── Facility Management
   │      └── Nonaktifkan → putus otomatis seluruh reservasi belum selesai
   ├── Change Password
   └── Recap & Export
```

# 6. Functional Requirements

Functional Requirements diturunkan dari 17 User Story, keputusan akun yang disepakati, dan pengaturan akun yang tersedia di aplikasi. US-01 dan US-09 masing-masing didekomposisi menjadi dua requirement atomik; persetujuan akun dan pengaturan akun dicatat terpisah, sehingga total menjadi 21 FR. Dekomposisi ini menjaga traceability tanpa memaksa jumlah FR sama dengan jumlah User Story.

## 6.1 Pengunjung

### FR-01 — Melihat Fasilitas dan Ketersediaan

Sistem memungkinkan Pengunjung dan Pengguna melihat daftar fasilitas publik dan status ketersediaannya per slot. Pengunjung tidak perlu login; Admin dan Petugas tidak dapat mengakses halaman fasilitas publik, sementara Admin tetap mengelola fasilitas melalui modul Admin.

Perilaku/Aturan

- Informasi publik menampilkan status tersedia/tidak tersedia.
- Ketersediaan harus mencerminkan kondisi fasilitas dan reservasi yang telah disetujui.
Acceptance Criteria

- Pengunjung dapat membuka daftar fasilitas tanpa login dan Pengguna dapat membukanya setelah login.
- Admin dan Petugas tidak dapat membuka daftar atau detail fasilitas publik.
- Slot yang tidak tersedia ditampilkan tanpa membocorkan detail reservasi.
### FR-02 — Perlindungan Informasi Reservasi

Sistem menyembunyikan identitas pemesan, detail akun, dan tujuan penggunaan dari Pengunjung.

Acceptance Criteria

- Pengunjung tidak menerima nama pemesan atau tujuan reservasi melalui tampilan publik.
### FR-03 — Pencarian dan Filter Fasilitas

Sistem memungkinkan Pengunjung/Pengguna mencari berdasarkan nama atau lokasi serta menyaring fasilitas berdasarkan tipe, lokasi, dan kapasitas minimum.

Acceptance Criteria

- Kriteria filter menghasilkan daftar yang sesuai.
- Kondisi tanpa hasil menampilkan empty state.
## 6.2 Pengguna

### FR-04 — Pengajuan Reservasi

Pengguna yang login dan memiliki identitas institusional dapat mengajukan reservasi untuk fasilitas tertentu pada rentang waktu tertentu dengan tujuan penggunaan.

Preconditions

- Pengguna login.
- Akun Pengguna aktif dan telah disetujui Admin.
- Profil memiliki salah satu NIM/NIP/No. Pegawai.
- Fasilitas aktif.
Perilaku/Aturan

- Waktu mengikuti BR-01 dan BR-02.
- `start_time` tidak boleh lebih dari `now + 90 hari` dan tidak memiliki minimum lead time.
- Reservasi baru berstatus menunggu.
- Jika fasilitas bertipe ruangan, reservasi penuh memblokir seluruh alat di dalam ruangan untuk reservasi terpisah selama periode overlap; alat yang sedang dalam_perbaikan tetap tidak dapat digunakan dan tidak otomatis membuat ruangan tidak reservable.
- Jika fasilitas bertipe alat, reservasi alat membuat ruangan induk tidak dapat direservasi penuh pada periode overlap, tetapi alat lain yang tersedia di ruangan yang sama tetap dapat dipesan oleh Pengguna lain.
- Pengguna boleh memiliki beberapa pengajuan menunggu yang saling overlap. Ketika pengajuan dibandingkan dengan reservasi yang telah disetujui, aturan BR-17 membatasi overlap Pengguna lintas ruangan dan pengajuan penuh ruangan setelah reservasi alat.

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

Preconditions

- Pengguna login, akun aktif, dan telah disetujui Admin.

Perilaku/Aturan

- Input minimal: fasilitas, kategori, deskripsi, dan foto pendukung.
- Maksimal 8 foto per laporan; setiap file maksimal 2 MB; format yang diterima: JPG, JPEG, PNG.

- Jumlah file, tipe gambar/MIME, serta ukuran divalidasi di server.
Acceptance Criteria

- Laporan valid tersimpan dengan status baru.
### FR-08 — Pelacakan Status Laporan

Pengguna dapat melihat laporan miliknya dan status penanganannya.

Acceptance Criteria

- Status yang tampil hanya: baru, diproses, selesai, ditolak.
## 6.3 Petugas

### FR-09 — Dashboard Antrian

Petugas melihat reservasi berstatus menunggu dan laporan berstatus baru untuk diproses. Queue reservasi dikelompokkan berdasarkan slot waktu; segmen slot terdekat ditampilkan lebih dahulu dan item dalam segmen diurutkan dari pengajuan paling lama ke paling baru.

Acceptance Criteria

- Dashboard memisahkan antrian reservasi dan laporan sesuai status awal masing-masing.
- Queue reservasi menggunakan urutan segmen slot terdekat, kemudian `created_at ASC` di dalam segmen.
### FR-10 — Approve/Reject Reservasi

Petugas dapat menyetujui atau menolak reservasi berstatus menunggu.

Preconditions

- Petugas login.
- Reservasi berstatus menunggu.
Acceptance Criteria

- Approval hanya berhasil setelah validasi konflik terbaru lolos. Setelah satu pengajuan disetujui, pengajuan menunggu lain yang kini konflik otomatis berubah menjadi ditolak; penolakan manual mewajibkan alasan dan mencatat waktu penolakan.
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

Petugas dapat memperbarui laporan menjadi diproses, selesai, atau ditolak. Catatan resolusi wajib diisi ketika laporan diselesaikan atau ditolak.

Acceptance Criteria

- Transisi status tidak menggunakan “dalam_perbaikan” sebagai status laporan.
### FR-14 — Perubahan Kondisi Fasilitas

Petugas dapat menandai fasilitas dalam_perbaikan dari laporan yang sedang diproses dan mengembalikannya ke aktif setelah laporan terkait selesai. Fasilitas nonaktif tidak dapat diubah oleh Petugas; fasilitas hanya dapat kembali aktif setelah tidak ada laporan lain yang masih baru atau diproses. Jika yang dalam_perbaikan adalah ruangan, seluruh alat di dalamnya tidak reservable; jika hanya alat yang dalam_perbaikan, ruangan induk tetap boleh direservasi dan Petugas dapat menginformasikan kondisi alat kepada pengaju secara langsung.

Acceptance Criteria

- Fasilitas yang dirinya dalam_perbaikan tidak dapat dipesan. Status dalam_perbaikan pada alat tidak otomatis membuat ruangan induk tidak reservable; status dalam_perbaikan pada ruangan membuat seluruh child tools tidak reservable.
- Perubahan kondisi memakai laporan terkait: dalam_perbaikan hanya saat laporan diproses; kembali aktif hanya setelah laporan selesai dan tidak ada laporan lain berstatus baru/diproses pada fasilitas tersebut.
## 6.4 Admin

### FR-15 — Pembuatan Akun Petugas

Admin dapat membuat akun Petugas secara langsung.

Perilaku/Aturan

- Petugas tidak memiliki self-registration.
Acceptance Criteria

- Akun Petugas yang dibuat Admin langsung berstatus disetujui dan dapat login sesuai kredensial.
### FR-16 — Pengelolaan Akun Pengguna oleh Admin

Admin dapat membuat akun Pengguna secara langsung tanpa melalui registrasi mandiri, menonaktifkan akun role apa pun, dan mengaktifkan kembali akun nonaktif.

Acceptance Criteria

- Akun yang dibuat Admin tercatat sebagai akun Pengguna.
- Penonaktifan akun mempertahankan histori reservasi dan laporan.
- Reservasi menunggu yang belum selesai ditolak dan `alasan_penolakan` menyebut akun pemesan dinonaktifkan oleh Admin; reservasi disetujui yang belum selesai dibatalkan dan `alasan_pembatalan` menyebut hal yang sama.
- Pengaktifan kembali hanya memulihkan akses akun; status reservasi tidak dipulihkan.
- Pengguna tidak dapat menonaktifkan akunnya sendiri.
- Admin terakhir tidak dapat dinonaktifkan.
### FR-17 — Pengelolaan Profil dan Identitas Pengguna

Pengguna dapat melihat dan mengubah profil setelah login, termasuk nama, email, WhatsApp, dan salah satu identitas institusional berupa NIM/NIP/No. Pegawai.

Acceptance Criteria

- Registrasi mandiri hanya membutuhkan email, nama lengkap, dan password; akun menunggu persetujuan Admin sebelum dapat login.
- Pengguna dapat memperbarui alamat email yang unik dan valid; perubahan email tidak memerlukan verifikasi email.
- Pengguna tanpa identitas institusional diarahkan melengkapi profil sebelum reservasi.
- Form reservasi tidak meminta identitas ulang.

### FR-18 — Pengelolaan Fasilitas

Admin dapat menambah, melihat, mengubah, dan menonaktifkan fasilitas.

Perilaku/Aturan

- Penonaktifan fasilitas mengubah kondisi menjadi `nonaktif`; tindakan ini berbeda dari penghapusan permanen.
- Ketika Admin menonaktifkan fasilitas, sistem langsung menolak seluruh reservasi menunggu dan membatalkan seluruh reservasi disetujui yang belum selesai pada fasilitas tersebut; bila berupa ruangan, dampak juga berlaku pada semua alat turunannya.
- Penonaktifan Admin tidak membutuhkan alasan Petugas dan tidak menghasilkan pesan pembatalan khusus; status akhir tetap terlihat pada riwayat pengguna.
- Penghapusan permanen dibolehkan hanya jika fasilitas tidak memiliki riwayat reservasi dan tidak memiliki alat turunan; jika salah satu kondisi tersebut tidak terpenuhi, penghapusan diblokir.

Acceptance Criteria

- Fasilitas nonaktif tidak tersedia untuk reservasi baru.
- Penghapusan permanen diblokir oleh controller jika fasilitas memiliki riwayat reservasi atau alat turunan.
- Jika laporan masih mereferensikan fasilitas, foreign key mencegah penghapusan; kode saat ini belum memberi pesan validasi khusus untuk kondisi tersebut.
### FR-19 — Rekap dan Export

Admin dapat melihat rekap okupansi dan frekuensi kerusakan per fasilitas/lokasi dan mengekspornya ke CSV/Excel/PDF.

Acceptance Criteria

- Rekap dapat difilter sesuai data yang tersedia.
- Export menghasilkan format yang dipilih atau error yang informatif.

### FR-20 — Persetujuan Akun Hasil Registrasi Mandiri

Admin dapat melihat akun Pengguna hasil registrasi mandiri yang menunggu persetujuan dan menyetujuinya.

Acceptance Criteria

- Akun hasil registrasi mandiri tidak dapat login sebelum disetujui Admin.
- Setelah disetujui, akun dapat login dan menggunakan fitur sesuai role.
- Persetujuan mencatat waktu dan Admin yang menyetujui.
- Akun Pengguna atau Petugas yang dibuat langsung oleh Admin berstatus disetujui saat dibuat.
- Akun hasil registrasi mandiri dapat login setelah persetujuan Admin tanpa verifikasi email.

### FR-21 — Pengaturan Kata Sandi dan Tampilan

Setiap akun yang sudah login dapat mengubah kata sandi dan memilih tampilan aplikasi. Admin juga dapat mengubah kata sandinya sendiri melalui halaman pengelolaan Admin.

Acceptance Criteria

- Perubahan kata sandi meminta kata sandi saat ini, kata sandi baru, dan konfirmasi kata sandi baru.
- Pengguna dapat memilih tampilan terang, gelap, atau mengikuti pengaturan perangkat.
- Preferensi tampilan disimpan di browser dan digunakan kembali pada kunjungan berikutnya.
# 7. Validasi dan Penanganan Kasus Tepi

## 7.1 Authentication, Registration & Profile

- Email registrasi sudah terdaftar → tolak dengan validation error.
- Email/password tidak valid → tolak dengan pesan yang tidak membocorkan detail sensitif.
- Registrasi mandiri berhasil → akun berstatus menunggu persetujuan Admin dan belum dapat login.
- Login dengan akun yang masih menunggu persetujuan → tolak dan jelaskan bahwa akun belum disetujui.
- Email tidak perlu diverifikasi; persetujuan Admin menjadi satu-satunya verifikasi akun Pengguna.
- Akun hasil registrasi mandiri yang disetujui Admin → dapat login.
- Persetujuan Admin → catat waktu dan Admin penyetuju; akun dapat login dan bertransaksi sesuai role.
- Pengguna tanpa NIM/NIP/No. Pegawai lalu mencoba reservasi → arahkan ke halaman profil.
- Akun nonaktif tidak dapat login atau membuat transaksi baru; histori tetap dapat direferensikan.
- Admin dapat mengaktifkan kembali akun nonaktif; Admin terakhir tidak dapat dinonaktifkan.
- Saat akun dinonaktifkan, reservasi menunggu yang belum selesai berubah menjadi ditolak dengan alasan penonaktifan Admin; reservasi disetujui yang belum selesai berubah menjadi dibatalkan dengan alasan yang sama. Reservasi selesai dan status terminal tidak berubah.
- Pengaktifan kembali akun tidak memulihkan status reservasi yang sudah berubah.
## 7.2 Reservasi

- start_time >= end_time → tolak.
- Pengguna belum login, akun belum aktif/disetujui, atau identitas institusional belum lengkap → tolak akses/pengajuan reservasi.
- Waktu sebelum 07:00 atau sesudah 20:00 → tolak.
- Waktu bukan kelipatan 30 menit → tolak.
- start_time lebih dari `now + 90 hari` atau tidak lebih besar dari waktu saat pengajuan → tolak.
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
- Scheduler memproses reservasi kedaluwarsa setiap menit; reservasi menunggu dengan `start_time` yang telah tercapai diubah menjadi `ditolak` pada eksekusi scheduler pertama setelah waktu mulai. Sistem mengisi `alasan_penolakan` dan `ditolak_pada`; reservasi tidak menjadi occupancy.

## 7.3 Laporan Kerusakan

- Facility ID tidak valid → not found.
- Pengguna belum login atau akun belum aktif/disetujui → tolak akses/pengajuan laporan.
- Kategori/deskripsi kosong → validation error.
- Tidak ada foto pendukung → validation error karena FR-07 menetapkan foto sebagai input minimal.
- Foto bukan tipe image yang diperbolehkan → tolak upload.
- Satu file > 2 MB → tolak dengan pesan informatif.
- Jumlah lampiran > 8 file → tolak request.
- Format selain JPG/JPEG/PNG → tolak upload.

- Petugas mencoba transisi status yang tidak diizinkan → tolak.
- Laporan selesai atau ditolak dicoba diproses ulang → tolak; tidak ada alur pembukaan kembali laporan.
## 7.4 Fasilitas

- Kapasitas negatif → validation error.
- Nama/tipe/lokasi wajib sesuai field yang ditetapkan.
- Admin mencoba menghapus permanen fasilitas yang memiliki riwayat atau alat turunan → blokir penghapusan; fasilitas dapat dinonaktifkan.
- Admin menghapus fasilitas tanpa riwayat dan tanpa alat turunan → hapus permanen.
- Jika laporan masih mereferensikan fasilitas yang hendak dihapus, foreign key menolak penghapusan; kode saat ini belum mengubah kegagalan itu menjadi pesan validasi khusus.
- Admin menonaktifkan fasilitas dengan reservasi menunggu/disetujui yang belum selesai → sistem otomatis mengubah menunggu→ditolak dan disetujui→dibatalkan; bila fasilitas berupa ruangan, reservasi alat turunannya ikut terdampak. Tidak memerlukan alasan Petugas.
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
- Konfirmasi penonaktifan akun menjelaskan bahwa reservasi menunggu yang belum selesai akan ditolak dan reservasi disetujui yang belum selesai akan dibatalkan dengan alasan akun dinonaktifkan oleh Admin.
- Setelah registrasi mandiri, tampilkan bahwa akun menunggu persetujuan Admin dan belum dapat login. Setelah disetujui, Pengguna dapat login.
- Pengguna tidak menerima pesan pembatalan khusus akibat penonaktifan fasilitas oleh Admin; namun status reservasi yang berubah tetap ditampilkan pada riwayat/detail.
- UI pemilihan fasilitas harus menampilkan konteks ruangan–alat: tool reservation dapat berbagi ruangan dengan tool lain, tetapi membuat full-room reservation unavailable pada slot overlap; full-room reservation membuat seluruh tool unavailable. Jika suatu tool sedang dalam_perbaikan tetapi room tetap reservable, kondisi tool harus terlihat dan dapat diperkuat melalui konfirmasi langsung Petugas.

- Setelah submit/approval/rejection, sistem memberikan feedback sukses/gagal yang jelas.
- Validation message muncul dekat field terkait dan tetap divalidasi server-side.
- Semua halaman menyediakan loading, empty, error, dan success state yang relevan.
- Desain responsif pada desktop dan mobile browser.
- Primary color #2D4C79 digunakan konsisten dengan kontras teks yang memadai.
- Setelah registrasi mandiri, Pengguna diberi pesan bahwa akun menunggu persetujuan Admin. Setelah Admin menyetujui, Pengguna dapat login; identitas institusional tetap wajib sebelum reservasi.
## 8.2 Struktur Halaman Pengunjung

```text
Home (`/` mengarahkan Pengunjung/Pengguna ke fasilitas)
Facilities
 └── Facility Detail
      └── Availability
Login
Register
```

## 8.3 Struktur Halaman Pengguna

```text
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

Pengguna tidak memiliki halaman dashboard tersendiri; `/dashboard` mengarahkan Pengguna ke riwayat reservasinya. Pengaturan profil, kata sandi, dan tampilan tersedia sebagai halaman akun terautentikasi.

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
 │    ├── Create Petugas
 │    └── Create Pengguna
 ├── Facility Management
 │    ├── Facility List
 │    ├── Create Facility
 │    └── Edit / Deactivate
 ├── Change Password
 └── Recap
      ├── Occupancy
      ├── Damage Frequency
      └── Export
```

## 8.6 Halaman Pengaturan Akun Terautentikasi

```text
Profile & Institutional Identity
Security Settings (Change Password)
Appearance Settings (Light / Dark / System)
```

# 9. Non-Functional Requirements

| ID | Kategori | Requirement |
| --- | --- | --- |
| NFR-01 | Arsitektur Kode | Aplikasi menggunakan Laravel sebagai backend dan Inertia.js + React + TypeScript sebagai frontend. Laravel menangani routing, request, akses data, validasi, dan otorisasi; React pages/components menangani UI. Tanggung jawab dipisahkan secara logis mengikuti struktur proyek. |
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
| R-04 | Akun atau hak akses tidak sah | Tinggi | Akun nonaktif masih digunakan, akun Petugas dibuat di luar alur Admin, atau Pengguna mengajukan reservasi tanpa identitas institusional. | Blokir login/transaksi akun nonaktif, buat akun Petugas hanya melalui Admin, wajibkan identitas sebelum reservasi, dan terapkan RBAC server-side. |
| R-05 | Kebocoran informasi reservasi | Tinggi | Pengunjung melihat nama/tujuan pemesan. | Pisahkan response/view publik dari data reservasi internal. |
| R-06 | Upload file berbahaya | Sedang | Security/storage issue dari foto laporan. | Maksimal 8 file, masing-masing 2 MB; hanya JPG/JPEG/PNG; validasi MIME/type, nama file aman, dan storage non-executable. |
| R-07 | Penghapusan permanen fasilitas | Tinggi | Penghapusan dapat memutus referensi reservasi, laporan, atau alat turunan. | Controller memblokir fasilitas bereservasi dan fasilitas yang masih memiliki alat turunan; foreign key melindungi relasi laporan, tetapi belum ditangani dengan pesan validasi khusus. |
| R-08 | Inkonsistensi status laporan/fasilitas | Sedang | Laporan selesai tetapi fasilitas tetap dalam_perbaikan atau sebaliknya. | Service/transaction terpusat untuk update terkait dan validasi transisi. |
| R-09 | Export berat | Sedang | Timeout/memory tinggi. | Query efisien, filter periode bila dibutuhkan, streaming/chunking jika implementasi memerlukan. |
| R-10 | Requirement drift atau interpretasi berbeda | Tinggi | Anggota tim menerapkan rule yang tidak konsisten meski OD utama sudah ditutup. | Gunakan SRS final, traceability, dan change control; perubahan rule harus disetujui sebelum coding. |
| R-11 | Inkonsistensi availability ruangan–alat | Tinggi | Ruangan atau alat dapat double-book akibat validasi hanya memeriksa facility_id langsung. | Gunakan validasi hierarki asimetris: room→all tools; tool→self + blocks full-room; sibling tools tetap dapat coexist. Validasi ulang saat approval. |
| R-12 | Penonaktifan fasilitas memutus banyak reservasi | Tinggi | Perubahan massal status dapat tidak konsisten jika proses gagal sebagian. | Lakukan perubahan fasilitas dan seluruh reservation transition terkait dalam database transaction/operasi atomik. |
| R-13 | Multi-file upload berlebihan/berbahaya | Sedang | Penyimpanan membengkak atau file tidak aman. | Batasi maksimal 8 file × 2 MB, hanya JPG/JPEG/PNG, validasi MIME, dan simpan pada storage non-executable. |
| R-14 | Kondisi tool rusak tidak terlihat pada reservasi room | Sedang | Pengguna memesan ruangan dengan asumsi semua alat siap pakai. | Tampilkan kondisi tool pada detail room dan availability; Petugas dapat mengonfirmasi langsung alat yang sedang dalam_perbaikan. |
| R-15 | Scheduler tidak berjalan | Tinggi | Pengajuan menunggu yang telah melewati waktu mulai belum berubah menjadi ditolak. | Pastikan proses scheduler Laravel dijalankan setiap menit pada lingkungan aplikasi. |

# 11. Traceability User Story

| User Story | FR | Aktor | Domain | BR terkait |
| --- | --- | --- | --- | --- |
| US-01 | FR-01, FR-02 | Pengunjung | Facility Discovery | BR-04, BR-08 |
| US-02 | FR-03 | Pengunjung | Facility Discovery | — |
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
| US-15 | FR-20 | Admin | Account Approval | BR-06 |
| US-16 | FR-18 | Admin | Facility Management | BR-14, BR-18 |
| US-17 | FR-19 | Admin | Analytics/Export | BR-21 |
| — | FR-21 | Pengguna/Petugas/Admin | Account Settings | BR-18 |

US-15 kembali masuk scope berdasarkan keputusan persetujuan akun terbaru dan dipenuhi oleh FR-20. FR-17 meliputi pengelolaan profil dan identitas tanpa verifikasi email. FR-21 mencatat pengaturan akun yang tersedia di aplikasi dan tidak berasal dari User Story sumber.

# 12. Technical Design Overview

Bagian ini ditempatkan setelah requirement inti agar desain teknis tidak mengunci solusi sebelum kebutuhan bisnis, RBAC, flow, validasi, dan edge case didefinisikan.

## 12.1 Technology Stack

- Backend / application framework: Laravel 13.
- Frontend bridge and UI: Inertia.js 3, React 19, and TypeScript.
- Styling and asset build: Tailwind CSS 4 and Vite.
- Database: relasional (mengikuti implementasi tim; rancangan awal menggunakan tabel Users, Facilities, Reservations, Reports).
- Version control: GitHub atau GitLab repository bersama.
## 12.2 Rancangan Database Rekomendasi

Tabel domain di bawah mengikuti migration aplikasi. Tabel pendukung Laravel dan Passkeys juga dicantumkan agar rancangan mencerminkan database kosong setelah seluruh migration dijalankan. Akun dinonaktifkan dengan mencatat waktu penonaktifan; histori tetap utuh dan akses dapat dipulihkan oleh Admin.

### users

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID |
| nama | VARCHAR(100) | Nama lengkap |
| email | VARCHAR(100) UNIQUE | Email login |
| password | VARCHAR(255) | Password hash |
| two_factor_secret | TEXT NULL | Secret autentikasi dua faktor yang dikelola Fortify |
| two_factor_recovery_codes | TEXT NULL | Kode pemulihan autentikasi dua faktor |
| two_factor_confirmed_at | TIMESTAMP NULL | Waktu autentikasi dua faktor dikonfirmasi |
| role | ENUM | pengguna/petugas/admin |
| approved_at | TIMESTAMP NULL | Waktu akun disetujui; NULL berarti registrasi mandiri masih menunggu persetujuan Admin. Akun yang dibuat Admin disetujui saat dibuat. |
| approved_by | BIGINT FK NULL | ID Admin yang menyetujui akun registrasi mandiri atau membuat akun langsung; NULL selama menunggu dan untuk Admin awal yang diprovision developer. |
| institutional_id | VARCHAR(100) NULL | NIM/NIP/No. Pegawai; salah satu wajib sebelum reservasi |
| identity_type | ENUM NULL | nim/nip/no_pegawai |
| whatsapp | VARCHAR(30) NULL | Nomor WhatsApp pada profil |
| remember_token | VARCHAR(100) NULL | Token sesi login "remember me" |
| created_at, updated_at | TIMESTAMP NULL | Waktu pembuatan dan perubahan data |
| deleted_at | TIMESTAMP NULL | Waktu akun dinonaktifkan; NULL berarti aktif. Admin dapat mengaktifkan kembali akun dengan mengosongkan nilai ini. |

> Kode aplikasi juga menyediakan properti `name` untuk kompatibilitas framework; nilainya berasal dari `nama` dan bukan kolom database terpisah.

### facilities

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID |
| name | VARCHAR(100) | Nama fasilitas |
| type | ENUM | ruang_kelas/aula/laboratorium/alat/lapangan |
| location | VARCHAR(100) | Gedung/Lantai/Lokasi |
| capacity | INT UNSIGNED DEFAULT 0 | Kapasitas, >= 0 |
| description | TEXT NULL | Deskripsi |
| condition | ENUM | aktif/dalam_perbaikan/nonaktif. Status parent room memengaruhi reservability child tools; status tool tidak otomatis mengubah status parent room. |
| parent_facility_id | BIGINT FK NULL | Nullable di database; aplikasi mewajibkan ruangan induk untuk tipe Alat. Lapangan tidak dapat menjadi parent; alat harus terkait ke satu ruang kelas/aula/lab. |
| created_at, updated_at | TIMESTAMP | Waktu pembuatan dan perubahan data |

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
| alasan_penolakan | TEXT NULL | Alasan penolakan, termasuk pengajuan kedaluwarsa atau akun pemesan dinonaktifkan Admin |
| ditolak_pada | TIMESTAMP NULL | Waktu reservasi ditolak; dipakai untuk riwayat penolakan |
| alasan_pembatalan | TEXT NULL | Alasan pembatalan oleh Petugas atau pembatalan otomatis saat akun pemesan dinonaktifkan |
| created_at, updated_at | TIMESTAMP | Waktu pembuatan dan perubahan data |

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
| created_at, updated_at | TIMESTAMP | Waktu pembuatan dan perubahan data |

### report_attachments

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID lampiran |
| report_id | BIGINT FK | Relasi ke reports.id |
| file_path | VARCHAR(255) | Path file pada storage |
| original_name | VARCHAR(255) | Nama file asli untuk display/audit |
| mime_type | VARCHAR(100) | Harus image/jpeg atau image/png sesuai validasi |
| file_size | INT UNSIGNED | Ukuran byte; maksimum 2 MB per file |
| created_at, updated_at | TIMESTAMP | Waktu pembuatan dan perubahan data |

### passkeys

| Field | Tipe/Constraint | Keterangan |
| --- | --- | --- |
| id | BIGINT PK AI | ID passkey |
| user_id | BIGINT FK | Pemilik passkey; foreign key cascade mengikuti penghapusan fisik baris pengguna |
| name | VARCHAR(255) | Nama passkey yang ditetapkan pengguna |
| credential_id | VARCHAR(255) UNIQUE | ID credential WebAuthn |
| credential | JSON | Data credential WebAuthn |
| last_used_at | TIMESTAMP NULL | Waktu terakhir passkey digunakan |
| created_at, updated_at | TIMESTAMP NULL | Waktu pembuatan dan perubahan data |

Catatan implementasi di luar scope: konfigurasi Fortify mengaktifkan pemulihan kata sandi, autentikasi dua faktor, dan passkeys, tetapi use case serta halaman React untuk fitur tersebut tidak termasuk dalam SRS saat ini. Halaman keamanan yang tercakup hanya menyediakan perubahan kata sandi.

### Tabel pendukung Laravel

Tabel berikut dibuat oleh migration kerangka kerja untuk autentikasi, session, cache, antrean, dan pelacakan migration; tabel ini bukan entitas domain AduPDF.

| Tabel | Field utama dan tipe |
| --- | --- |
| password_reset_tokens | `email` VARCHAR(255) PK, `token` VARCHAR(255), `created_at` TIMESTAMP NULL |
| sessions | `id` VARCHAR(255) PK, `user_id` BIGINT NULL INDEX, `ip_address` VARCHAR(45) NULL, `user_agent` TEXT NULL, `payload` LONGTEXT, `last_activity` INT INDEX |
| cache | `key` VARCHAR(255) PK, `value` MEDIUMTEXT, `expiration` BIGINT INDEX |
| cache_locks | `key` VARCHAR(255) PK, `owner` VARCHAR(255), `expiration` BIGINT INDEX |
| jobs | `id` BIGINT PK AI, `queue` VARCHAR(255) INDEX, `payload` LONGTEXT, `attempts` SMALLINT UNSIGNED, `reserved_at` INT UNSIGNED NULL, `available_at` INT UNSIGNED, `created_at` INT UNSIGNED |
| job_batches | `id` VARCHAR(255) PK, `name` VARCHAR(255), `total_jobs` INT, `pending_jobs` INT, `failed_jobs` INT, `failed_job_ids` LONGTEXT, `options` MEDIUMTEXT NULL, `cancelled_at` INT NULL, `created_at` INT, `finished_at` INT NULL |
| failed_jobs | `id` BIGINT PK AI, `uuid` VARCHAR(255) UNIQUE, `connection` VARCHAR(255), `queue` VARCHAR(255), `payload` LONGTEXT, `exception` LONGTEXT, `failed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP |
| migrations | `id` INT UNSIGNED PK AI, `migration` VARCHAR(255), `batch` INT |

> Akun hasil registrasi mandiri menunggu persetujuan Admin; akun yang dibuat Admin langsung berstatus disetujui. `approved_at` dan `approved_by` mencatat persetujuan, `deleted_at` menandai waktu penonaktifan, dan `institutional_id` + `identity_type` menyimpan identitas institusional.

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
    IF room.condition != aktif → tidak tersedia
    ELSE IF ada approved reservation langsung pada room yang overlap → tidak tersedia
    ELSE IF ada approved reservation pada salah satu child tool yang overlap → tidak tersedia untuk full-room reservation
    ELSE IF Pengguna punya approved reservation overlap pada ruangan lain → tidak tersedia bagi Pengguna tersebut
    ELSE → tersedia

IF target = ALAT:
    IF tool.condition != aktif → tidak tersedia
    ELSE IF parent room.condition != aktif → tidak tersedia
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

## 12.5 Route & Inertia Interaction Specification (Laravel + React)

Laravel menyediakan route dan mengirimkan data halaman melalui Inertia; React merender halaman dan komponen UI. Interaksi form dan navigasi menggunakan Inertia pada route Laravel. Karena itu, bagian ini menetapkan route dan perilaku interaksi tanpa mengasumsikan REST API terpisah.

| Method | Route | Aktor | Fungsi |
| --- | --- | --- | --- |
| GET | /register | Pengunjung | Form registrasi Pengguna |
| POST | /register | Pengunjung | Submit registrasi → akun menunggu persetujuan Admin dan belum dapat login |
| GET | /login | Pengunjung | Form login |
| POST | /login | Pengunjung | Login hanya untuk akun yang disetujui dan tidak dinonaktifkan |
| POST | /logout | Authenticated | Logout |
| GET/PATCH | /profile | Authenticated | Lihat/ubah profil, identitas institusional, WhatsApp, dan email |
| GET/PATCH | /settings/profile | Authenticated | Alias halaman pengaturan profil |
| GET | /settings/security | Authenticated | Halaman keamanan dan perubahan kata sandi |
| PUT | /settings/password | Authenticated | Ubah kata sandi dengan verifikasi kata sandi saat ini |
| GET | /settings/appearance | Authenticated | Halaman pilihan tampilan |
| GET | /dashboard | Authenticated | Redirect ke halaman awal sesuai role |
| GET | /admin/users | Admin | Daftar/pengelolaan akun, termasuk akun registrasi mandiri yang menunggu persetujuan |
| PATCH | /admin/users/{user}/approve | Admin | Setujui akun hasil registrasi mandiri dan catat Admin/waktu persetujuan |
| GET | /facilities | Pengunjung/Pengguna | Daftar/search/filter fasilitas; Admin/Petugas diarahkan ke dashboard |
| GET | /facilities/{facility} | Pengunjung/Pengguna | Detail dan availability; Admin/Petugas diarahkan ke dashboard |
| GET | /reservations | Pengguna | Riwayat sendiri |
| GET | /reservations/create | Pengguna | Form reservasi |
| POST | /reservations | Pengguna | Buat reservasi |
| GET | /reservations/{reservation} | Pengguna | Detail sendiri |
| PATCH | /reservations/{reservation}/cancel | Pengguna | Cancel sendiri |
| GET | /reports | Pengguna | Laporan sendiri |
| GET | /reports/create | Pengguna | Form laporan |
| POST | /reports | Pengguna | Buat laporan + unggah maksimal 8 foto JPG/JPEG/PNG @ 2 MB |
| GET | /reports/{report} | Pengguna | Detail/status sendiri |
| GET | /petugas/dashboard | Petugas | Dashboard dengan antrian reservasi per slot dan laporan baru |
| GET | /petugas/reservations | Petugas | Daftar reservasi menunggu dan reservasi disetujui |
| PATCH | /petugas/reservations/{reservation}/approve | Petugas | Approve + validasi konflik terbaru + auto-reject pending requests yang kini konflik |
| PATCH | /petugas/reservations/{reservation}/reject | Petugas | Reject |
| PATCH | /petugas/reservations/{reservation}/cancel | Petugas | Cancel darurat |
| GET | /petugas/reports | Petugas | Daftar laporan baru |
| GET | /petugas/reports/{report} | Petugas | Detail laporan |
| PATCH | /petugas/reports/{report} | Petugas | Update status/catatan laporan |
| PATCH | /petugas/reports/{report}/facility-condition | Petugas | Update kondisi fasilitas terkait laporan |
| GET | /admin/users/petugas/create | Admin | Form Petugas |
| POST | /admin/users/petugas | Admin | Create Petugas |
| GET | /admin/users/pengguna/create | Admin | Form Pengguna |
| POST | /admin/users/pengguna | Admin | Create Pengguna |
| PATCH | /admin/users/{user}/deactivate | Admin | Nonaktifkan akun; tolak reservasi menunggu dan batalkan reservasi disetujui yang belum selesai dengan alasan akun dinonaktifkan Admin |
| PATCH | /admin/users/{user}/activate | Admin | Aktifkan kembali akun; histori tetap tersedia |
| GET/PUT | /admin/change-password | Admin | Form dan proses perubahan kata sandi Admin |
| GET | /admin/facilities | Admin | Kelola fasilitas |
| GET | /admin/facilities/create | Admin | Form tambah fasilitas |
| POST | /admin/facilities | Admin | Tambah fasilitas |
| GET | /admin/facilities/{facility} | Admin | Detail fasilitas |
| GET | /admin/facilities/{facility}/edit | Admin | Form ubah fasilitas |
| PUT/PATCH | /admin/facilities/{facility} | Admin | Update fasilitas |
| DELETE | /admin/facilities/{facility} | Admin | Hapus permanen dengan pemeriksaan riwayat reservasi dan alat turunan |
| PATCH | /admin/facilities/{facility}/deactivate | Admin | Nonaktifkan absolut; pending→ditolak dan approved→dibatalkan otomatis |
| PATCH | /admin/facilities/{facility}/activate | Admin | Aktifkan kembali fasilitas |
| GET | /admin/recap | Admin | Rekap |
| GET | /admin/recap/export | Admin | Export |

# 13. Ringkasan Perubahan dan Alasan

| Perubahan | Alasan |
| --- | --- |
| FR menjadi 21 | Sumber tetap 17 User Story; US-01 dan US-09 dipecah menjadi requirement atomik, lalu persetujuan akun dan pengaturan akun yang telah tersedia diimplementasikan sebagai requirement terpisah. |
| Persetujuan akun tanpa verifikasi email | Akun Pengguna baru menunggu persetujuan Admin sebelum login; persetujuan Admin satu-satunya verifikasi akun. Akun yang dibuat Admin sudah disetujui saat pembuatan. |
| Hak akses fasilitas | Hanya Pengunjung dan Pengguna dapat membuka halaman fasilitas; Admin/Petugas diarahkan ke dashboard masing-masing. |
| Profil identitas institusional | NIM/NIP/No. Pegawai dilengkapi setelah login dan salah satunya wajib sebelum reservasi. |
| Pengaturan kata sandi dan tampilan | Halaman akun yang tersedia memungkinkan perubahan kata sandi dan pilihan tampilan terang/gelap/sesuai sistem. |
| Horizon reservasi 90 hari | Pengajuan boleh sampai `now + 90 hari` tanpa minimum lead time. |
| Pending auto-reject | Scheduler berjalan setiap menit; pengajuan yang telah melewati `start_time` menjadi ditolak pada eksekusi berikutnya dengan alasan kedaluwarsa dan waktu penolakan. |
| Queue Petugas bersegmen slot | Slot paling dekat ditampilkan lebih dahulu; dalam setiap segmen pengajuan diurutkan created_at paling lama ke paling baru. |
| Penonaktifan akun | Admin dapat menonaktifkan dan mengaktifkan kembali akun tanpa menghapus histori; reservasi menunggu yang belum selesai ditolak, reservasi disetujui yang belum selesai dibatalkan dengan alasan penonaktifan Admin, dan Admin terakhir dilindungi. |
| Petugas tidak self-register | User Story 13 menyatakan akun Petugas dibuat Admin. |
| Status laporan tidak memiliki “dalam_perbaikan” | “dalam_perbaikan” adalah kondisi fasilitas; status laporan mengikuti baru/diproses/selesai/ditolak. |
| Dashboard Petugas memakai reservasi menunggu + laporan baru | Menyelaraskan state awal masing-masing domain. |
| Penghapusan fasilitas dibatasi | Penghapusan permanen diblokir jika ada reservasi atau alat turunan; foreign key melindungi laporan terkait. Penonaktifan tetap menjadi cara menghentikan penggunaan tanpa menghapus riwayat. |
| Availability dihitung, tidak disimpan statis | Mencegah data ketersediaan tidak sinkron dengan status fasilitas/reservasi approved. |
| API Specification diganti Route & Interaction Specification | Laravel + Inertia.js + React menggunakan route Laravel dan interaksi halaman Inertia; REST API terpisah hanya diperlukan jika ada kebutuhan integrasi khusus. |
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

Tidak ada Open Decision aktif. OD-01 dan OD-02 telah ditetapkan berada di luar ruang lingkup SRS saat ini.