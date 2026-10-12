# PANDUAN DEKODER FUNDAMENTAL & ESENSIAL SINTAKS CODEBASE ADUPDF
**Buku Kunci & Peta Dekoder Baris Kode: Memahami 95% Baris Kode Proyek Secara Cepat dan Efisien**

---

## DAFTAR ISI
1. [Prinsip 80/20 & Cara Menggunakan Panduan Ini](#1-prinsip-8020--cara-menggunakan-panduan-ini)
2. [BAB 1: Kunci Dekoder Sintaks PHP 8.4 & Laravel 12 (Backend Core)](#2-bab-1-kunci-dekoder-sintaks-php-84--laravel-12-backend-core)
3. [BAB 2: Kunci Dekoder Sintaks TypeScript & React 19 (Frontend Core)](#3-bab-2-kunci-dekoder-sintaks-typescript--react-19-frontend-core)
4. [BAB 3: Anatomi Parameter & Variabel: Dari Mana ke Mana?](#4-bab-3-anatomi-parameter--variabel-dari-mana-ke-mana)
5. [BAB 4: The 5 Archetypes (5 Pola Template Berulang di AduPDF)](#5-bab-4-the-5-archetypes-5-pola-template-berulang-di-adupdf)
6. [BAB 5: Bedah Kasus Nyata Baris-demi-Baris (Line-by-Line Annotation)](#6-bab-5-bedah-kasus-nyata-baris-demi-baris-line-by-line-annotation)
7. [BAB 6: Lembar Contekan Cepat Simbol & Operator (The Cheat Sheet Matrix)](#7-bab-6-lembar-contekan-cepat-simbol--operator-the-cheat-sheet-matrix)

---

## 1. PRINSIP 80/20 & CARA MENGGUNAKAN PANDUAN INI

Membaca puluhan ribu baris kode satu per satu dari atas ke bawah (*sequential reading*) adalah cara belajar yang sangat tidak efisien dan melelahkan. Di dunia rekayasa perangkat lunak modern, sebuah aplikasi besar dibangun di atas **fondasi idiomatis (*idiomatic patterns*)** yang berulang ratusan kali.

> [!TIP]
> **Prinsip Pareto (80/20):**
> 80% hingga 95% dari seluruh baris kode di AduPDF adalah variasi dari **5 pola template (*archetypes*)** yang menggunakan sekumpulan sintaks modern tertentu. Jika Anda menguasai kunci sintaks, asal variabel, dan kelima pola tersebut, Anda akan mampu membaca dan memahami maksud baris kode mana pun di proyek ini dalam hitungan detik.

---

## 2. BAB 1: KUNCI DEKODER SINTAKS PHP 8.4 & LARAVEL 12 (BACKEND CORE)

Di backend AduPDF, PHP 8.4 dieksekusi dengan fitur bahasa modern yang sangat ringkas namun kaya makna (*expressive*). Berikut adalah kunci pembacaan sintaksnya:

### 1.1 Constructor Property Promotion
*Gaya Tradisional (PHP 5/7):* Mendeklarasikan properti kelas, menerima argumen di constructor, lalu meng-assign manual satu per satu (`$this->service = $service;`).
*Sintaks Modern AduPDF (PHP 8):* Deklarasi properti dan assignment dilakukan sekaligus di dalam parameter `__construct()`.

```php
// AduPDF Pattern:
class ReservationController extends Controller
{
    public function __construct(
        public ReservationConflictService $conflicts,
        public FacilityConditionService $conditions,
    ) {}
}
```
*Cara Membaca:* Kata kunci `public` atau `protected` di depan parameter constructor secara otomatis membuat properti kelas dengan nama yang sama dan langsung mengisinya saat instansiasi.

---

### 1.2 PHP Attributes (`#[Attribute]`)
Attributes adalah anotasi metadata deklaratif tingkat bahasa yang dievaluasi oleh reflection engine.
Di AduPDF, attributes digunakan secara elegan pada Model Eloquent:

```php
// Cuplikan nyata di app/Models/Reservation.php:
#[Fillable(['user_id', 'facility_id', 'tujuan', 'start_time', 'end_time', 'status', 'alasan_penolakan', 'ditolak_pada', 'alasan_pembatalan'])]
class Reservation extends Model
{
    // ...
}

// Cuplikan nyata di app/Models/User.php:
#[Fillable(['nama', 'name', 'email', 'password', 'role', 'institutional_id', 'identity_type', 'whatsapp'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token', 'approved_by'])]
class User extends Authenticatable
{
    // ...
}
```
*Cara Membaca:*
- `#[Fillable([...])]`: Memberitahu Laravel kolom database mana saja yang diizinkan untuk diisi secara massal (*Mass Assignment*) via `Model::create($data)`.
- `#[Hidden([...])]`: Menjamin bahwa kolom sensitif seperti hash password dan token keamanan **tidak akan pernah bocor** saat model dikonversi menjadi array atau JSON yang dikirim ke browser.

---

### 1.3 First-Class Backed Enums
Alih-alih menggunakan string mentah (*magic strings*) seperti `'menunggu'`, `'disetujui'`, atau angka biner `0, 1` yang rawan salah ketik (*typo*), AduPDF menggunakan PHP 8 Backed Enums.

```php
// Cuplikan nyata di app/Enums/ReservationStatus.php:
namespace App\Enums;

enum ReservationStatus: string
{
    case Pending = 'menunggu';
    case Approved = 'disetujui';
    case Rejected = 'ditolak';
    case Cancelled = 'dibatalkan';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Menunggu',
            self::Approved => 'Disetujui',
            self::Rejected => 'Ditolak',
            self::Cancelled => 'Dibatalkan',
        };
    }
}
```
*Cara Menggunakannya di Kode:*
- `ReservationStatus::Pending`: Mengacu pada objek enum itu sendiri (untuk type safety).
- `ReservationStatus::Pending->value`: Mengambil nilai string aslinya (`'menunggu'`), biasa digunakan untuk query database mentah.
- Model Casting: Di [`app/Models/Reservation.php`](file:///B:/0000_UNDIP/5.%20SMT%205/PPK_PROJECTS/AduPDF_Local/AduPDF/app/Models/Reservation.php), atribut `'status' => ReservationStatus::class` otomatis mengubah string database menjadi objek Enum saat dibaca di PHP.

---

### 1.4 Match Expression vs Switch
PHP 8 `match` adalah ekspresi yang mengembalikan nilai (*return value*), melakukan perbandingan ketat (*strict equality* `===`), dan tidak memerlukan pernyataan `break`.

```php
$statusLabel = match ($reservation->status) {
    ReservationStatus::Pending => 'Menunggu Verifikasi',
    ReservationStatus::Approved => 'Telah Disetujui',
    ReservationStatus::Rejected => 'Ditolak Petugas',
    default => 'Status Tidak Diketahui',
};
```

---

### 1.5 Strict Type Hints & Union Types
Di AduPDF, seluruh deklarasi fungsi memiliki kontrak tipe eksplisit:
- **Nullable Type (`?string`)**: Nilai bisa berupa `string` atau `null`.
- **Union Type (`int|string`)**: Nilai bisa berupa integer atau string (misal: ID fasilitas).
- **Void (`void`)**: Fungsi melakukan aksi (efek samping) dan tidak mengembalikan nilai.
- **Array Shape (di PHPDoc)**: Memberikan kejelasan struktur array asosiatif bagi IDE dan static analysis.

```php
/**
 * @return array<string, int|string|array<string, int|string>>
 */
private function reportListData(Report $report): array
{
    return [
        'id' => $report->id,
        'kategori' => $report->kategori,
        'facility' => [
            'id' => $report->facility->id,
            'name' => $report->facility->name,
        ],
    ];
}
```

---

### 1.6 Arrow Functions (`fn()`) vs Closures (`function() use ()`)
AduPDF membedakan dua bentuk fungsi anonim:
1. **Short Arrow Function (`fn(...) => ...`)**: Otomatis menangkap variabel dari scope luar (*by-value capture*) tanpa perlu kata kunci `use`. Hanya dapat memiliki satu baris ekspresi yang langsung di-return.
   ```php
   // Otomatis bisa membaca $baseUrl dari luar:
   $urls = $facilityUrls->map(fn (int $id): string => $baseUrl."/facilities/{$id}");
   ```
2. **Multi-line Closure (`function() use ($var) { ... }`)**: Digunakan untuk blok kode multi-baris (misalnya transaksi database). Harus secara eksplisit mendeklarasikan variabel luar yang ingin dibawa masuk menggunakan `use (...)`.
   ```php
   DB::transaction(function () use ($request, $input, $schedules) {
       foreach ($schedules as $sched) {
           Reservation::create([...]);
       }
   });
   ```

---

### 1.7 Method Chaining & Fluent Interfaces
Hampir seluruh query database dan manipulasi koleksi di AduPDF ditulis dengan gaya *fluent chaining*:
```php
$reservations = Reservation::query()
    ->with('facility:id,name,location') // Eager load relasi fasilitas (hanya kolom tertentu)
    ->where('user_id', $request->user()->id) // Filter pemilik
    ->latest('start_time') // Urutkan start_time DESC
    ->latest('id')         // Tie-breaker order by id DESC
    ->get()                // Eksekusi SQL dan ambil hasilnya (Eloquent Collection)
    ->map(fn (Reservation $r): array => $this->reservationData($r)) // Transformasi data
    ->values();            // Reset array keys menjadi 0, 1, 2...
```
*Aturan Emas Membaca Chaining:*
- Baris sebelum `->get()`, `->first()`, `->count()`, `->exists()`, atau `->update()` adalah **pembangunan kueri SQL** (belum menyentuh database).
- Pemanggilan `->get()` adalah saat **kueri dieksekusi** ke database engine.
- Baris setelah `->get()` adalah operasi pada **Collection PHP di memori**.

---

### 1.8 Dependency Injection & Service Container
Di controller AduPDF, Anda sering melihat parameter fungsi yang tidak pernah Anda kirimkan secara manual, seperti:
```php
public function create(Request $request, FacilityConditionService $conditions): Response
```
*Bagaimana parameter `$conditions` bisa terisi?*
Laravel memiliki **Service Container**. Ketika route diakses, Laravel menggunakan teknik *Reflection* untuk membaca tipe parameter fungsi. Begitu Laravel melihat tipe `FacilityConditionService`, Laravel secara otomatis membuat instansinya dan menyuntikkannya ke parameter tersebut (*Auto-wiring Dependency Injection*).

---

## 3. BAB 2: KUNCI DEKODER SINTAKS TYPESCRIPT & REACT 19 (FRONTEND CORE)

Di sisi klien, antarmuka dibangun menggunakan TypeScript dan React 19 dengan pola deklaratif dan fungsional:

### 2.1 Interface & Type Aliases
Setiap komponen mendefinisikan "kontrak" data yang diterimanya dari server melalui `type`:

```typescript
// Cuplikan nyata di resources/js/pages/reservations/create.tsx:
type Props = {
    facility: { 
        id: number; 
        name: string; 
        location: string 
    };
    reservable: boolean;
    success: string | null;
    server_now: string;
};

export default function CreateReservation({ facility, reservable, success, server_now }: Props) {
    // ...
}
```
*Cara Membaca:* Komponen `CreateReservation` menolak untuk berjalan jika server tidak mengirimkan properti `facility` dengan `id` bertipe angka, `name` teks, dan `reservable` boolean. Ini mencegah bug tampilan saat runtime.

---

### 2.2 Destructuring & Spread Operators
1. **Destructuring Parameter**:
   `({ facility, reservable }: Props)` langsung mengekstrak variabel `facility` dan `reservable` dari objek props yang diterima, sehingga tidak perlu menulis `props.facility` berulang kali.
2. **Object Spread (`...prev`)**:
   Digunakan untuk memperbarui objek state tanpa memutasinya secara langsung (*immutability principle*):
   ```typescript
   setForm(prev => ({
       ...prev,           // Salin semua field lama
       start_time: '08:00' // Timpa hanya start_time
   }));
   ```
3. **Array Spread (`[...items]`)**:
   ```typescript
   const updated = [...schedules, newScheduleSlot];
   ```

---

### 2.3 Nullish Coalescing (`??`) & Optional Chaining (`?.`)
Operator penyelamat dari error `Cannot read properties of undefined`:
- **Optional Chaining (`?.`)**: Jika objek di sebelah kiri bernilai `null` atau `undefined`, ekspresi langsung berhenti dan menghasilkan `undefined` tanpa memicu crash.
  ```typescript
  const parentId = reservation.facility?.parent_facility_id;
  ```
- **Nullish Coalescing (`??`)**: Hanya memberikan nilai default jika nilai di sebelah kiri adalah `null` atau `undefined` (berbeda dengan `||` yang juga menganggap string kosong `""` atau angka `0` sebagai false).
  ```typescript
  const requestedStart = params.get('start_time') ?? '';
  ```

---

### 2.4 Anatomi React Hooks di AduPDF
React 19 menggunakan fungsi-fungsi berkepala `use` (*Hooks*) untuk mengelola siklus hidup komponen:

| Hook | Sintaks Kunci | Kegunaan di AduPDF | Contoh Nyata |
| :--- | :--- | :--- | :--- |
| `useState` | `const [val, setVal] = useState(init)` | Menyimpan state reaktif lokal yang memicu render ulang saat diubah | [`resources/js/pages/reservations/create.tsx`](file:///B:/0000_UNDIP/5.%20SMT%205/PPK_PROJECTS/AduPDF_Local/AduPDF/resources/js/pages/reservations/create.tsx): menyimpan tanggal terpilih |
| `useEffect` | `useEffect(() => { ... }, [deps])` | Menjalankan aksi sampingan (*side-effects*) setelah komponen dirender | Sinkronisasi form saat URL query parameter berubah |
| `useRef` | `const el = useRef<HTMLDivElement>(null)` | Menyimpan referensi elemen HTML DOM atau nilai persisten tanpa memicu re-render | Referensi input focus atau container scrolling |
| `usePage` | `const { auth, flash } = usePage().props` | Mengakses data global yang dibagikan oleh middleware server Laravel | Mengambil data pengguna yang login dan notifikasi flash toast |
| `useForm` | `const { data, setData, post } = useForm(...)` | Form helper dari Inertia untuk menangani pengiriman data, error validasi, dan status loading | Pengiriman form pengajuan laporan kerusakan |

---

### 2.5 Ekosistem Inertia.js di Frontend
Inertia menyediakan komponen-komponen khusus yang menggantikan elemen HTML standar:
- `<Link href="/facilities">`: Menggantikan `<a href="...">`. Mencegah browser me-reload halaman utuh dan melakukan navigasi SPA melalui XHR.
- `<Head title="Judul">`: Secara dinamis mengubah judul tab browser dan meta tag tanpa perlu menulis script manipulasi dokumen HTML manual.
- Wayfinder Action: AduPDF mengimpor rute langsung dari controller backend yang telah di-generate ke TypeScript:
  ```typescript
  import { store as storeReservation } from '@/actions/App/Http/Controllers/ReservationController';
  ```

---

### 2.6 Conditional Rendering & List Mapping
Pola deklaratif untuk menampilkan antarmuka berdasarkan kondisi:
1. **Pola Guard (`condition && <Component />`)**:
   ```tsx
   {todayUnavailable && (
       <p className="text-sm text-amber-600">Jam operasional hari ini telah berakhir.</p>
   )}
   ```
2. **Pola Ternary (`condition ? <TrueView /> : <FalseView />`)**:
   ```tsx
   {reservable ? (
       <ButtonSubmit />
   ) : (
       <BadgeDisabled text="Fasilitas Sedang Rusak" />
   )}
   ```
3. **Pola Iterasi List (`items.map(...)`)**:
   ```tsx
   {schedules.map((schedule, index) => (
       <ScheduleCard key={`${schedule.date}-${index}`} item={schedule} />
   ))}
   ```
   *Catatan:* Atribut `key` wajib ada agar algoritma rekonsiliasi Virtual DOM React dapat melacak elemen mana yang bertambah, berubah, atau dihapus secara efisien.

---

## 4. BAB 3: ANATOMI PARAMETER & VARIABEL: DARI MANA KE MANA?

Salah satu kebingungan terbesar programmer saat membaca codebase besar adalah: *"Dari mana variabel ini berasal, dan siapa yang mengisinya?"*

Berikut adalah peta sirkulasi variabel di AduPDF:

```
+───────────────────────────────────────────────────────────────────────────────────+
|                           PETA SIRKULASI VARIABEL & DATA                         |
+───────────────────────────────────────────────────────────────────────────────────+

  [Browser User Interaction]
       │ (Input form teks, file, klik tombol)
       ▼
  React Component State / Inertia Form Payload
       │ (Dikirim via HTTP Request Header & Body)
       ▼
  Laravel HTTP Request ($request)
       │ (Diproses & disaring oleh FormRequest)
       ▼
  $request->validated() Array
       │ (Diteruskan ke Controller & Service)
       ▼
  Service Method Parameters ($user, $facility, $startTime, $endTime)
       │ (Dipetakan ke atribut Model Eloquent)
       ▼
  Model Instance ($reservation->status)
       │ (Disimpan ke database melalui PDO Query)
       ▼
  Inertia Props (Inertia::render('page', ['reservations' => $reservations]))
       │ (Dikirim kembali ke browser sebagai JSON)
       ▼
  React Page Component Props ({ reservations }: Props)
```

### 3.1 Pembedahan Asal-Usul Variabel Umum

#### A. `$request`
- **Asal:** Dibuat oleh framework Laravel dari variabel global PHP (`$_GET`, `$_POST`, `$_FILES`, `$_SERVER`, `$_COOKIE`) saat HTTP request masuk.
- **Cara Akses:**
  - `$request->user()`: Mengambil model [`User`](file:///B:/0000_UNDIP/5.%20SMT%205/PPK_PROJECTS/AduPDF_Local/AduPDF/app/Models/User.php) yang sedang login berdasarkan sesi aktif.
  - `$request->input('tujuan')`: Mengambil data input dari body request.
  - `$request->file('attachments')`: Mengambil instance berkas unggahan (`UploadedFile`).

#### B. `$request->validated()`
- **Asal:** Dihasilkan oleh kelas [`FormRequest`](file:///B:/0000_UNDIP/5.%20SMT%205/PPK_PROJECTS/AduPDF_Local/AduPDF/app/Http/Requests/StoreReservationRequest.php) setelah seluruh aturan di `rules()` berhasil diverifikasi.
- **Perbedaan Penting:** `$request->all()` mengambil SEMUA data mentah yang dikirim klien (berbahaya). Sedangkan `$request->validated()` **hanya mengambil field yang secara eksplisit lolos aturan validasi** (aman dari parameter injection).

#### C. Route Model Binding Parameter (misal: `Report $report`)
Perhatikan deklarasi method controller berikut:
```php
public function show(Request $request, Report $report): Response
```
Dan rutenya di [`routes/reports.php`](file:///B:/0000_UNDIP/5.%20SMT%205/PPK_PROJECTS/AduPDF_Local/AduPDF/routes/reports.php):
```php
Route::get('/reports/{report}', [ReportController::class, 'show']);
```
- **Asal `$report`:** Jika user membuka URL `/reports/42`, Laravel membaca segmen `{report}` bernilai `42`. Karena tipe parameter di controller adalah `Report`, Laravel secara otomatis mengeksekusi `Report::findOrFail(42)` di balik layar dan langsung memasukkan objek modelnya ke variabel `$report`. Jika ID tidak ditemukan, Laravel otomatis menghasilkan HTTP 404.

#### D. `$this` di PHP
- Di dalam Controller: Merujuk pada instance controller saat ini.
- Di dalam Model: Merujuk pada satu baris data (*record*) tabel yang sedang dimanipulasi.
- Di dalam FormRequest: Merujuk pada request HTTP itu sendiri (sehingga Anda bisa menulis `$this->user()` atau `$this->facility_id`).

#### E. Parameter Event di React (`e`)
```tsx
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/reservations');
};
```
- **Asal `e`:** *SyntheticEvent* yang dibuat oleh React yang membungkus *native browser event*.
- `e.preventDefault()`: Menginstruksikan browser agar membatalkan aksi bawaannya (yaitu submit formulir standar yang memicu reload halaman penuh).

---

## 5. BAB 4: THE 5 ARCHETYPES (5 POLA TEMPLATE BERULANG DI ADUPDF)

Hampir seluruh file di AduPDF dapat diklasifikasikan ke dalam salah satu dari 5 pola arsitektural ini:

```
+───────────────────────────────────────────────────────────────────────────────────+
|                         5 ARCHETYPES CODEBASE ADUPDF                              |
+───────────────────────────────────────────────────────────────────────────────────+
| 1. THE CONTROLLER   | Pintu gerbang alur data HTTP -> Service -> View Response    |
| 2. THE FORM REQUEST | Satpam penjaga validasi input & otorisasi hak akses         |
| 3. THE ELOQUENT     | Representasi tabel basis data, relasi, dan tipe data        |
| 4. THE SERVICE      | Otak logika bisnis murni, algoritma, dan transaksi          |
| 5. THE REACT PAGE   | Tampilan visual interaktif, state reaktif, dan event UI     |
+───────────────────────────────────────────────────────────────────────────────────+
```

---

### Archetype 1: The Controller (Pola Orkestrasi)
**Ciri Khas File:** Berada di `app/Http/Controllers/`, berakhiran `Controller.php`.
**Tanggung Jawab:** Menerima input, memanggil service bisnis, dan mengembalikan respon (Inertia view atau redirect).

```php
namespace App\Http\Controllers;

class FeatureController extends Controller
{
    // Pola Index / Read:
    public function index(Request $request): Response
    {
        $data = Model::query()
            ->where(...)
            ->get();

        return Inertia::render('feature/index', [
            'data' => $data,
        ]);
    }

    // Pola Store / Create:
    public function store(StoreFeatureRequest $request, FeatureService $service): RedirectResponse
    {
        $input = $request->validated();
        $service->execute($input);

        return redirect()->route('feature.index')->with('success', 'Pesan sukses');
    }
}
```

---

### Archetype 2: The Form Request (Pola Satpam Validasi)
**Ciri Khas File:** Berada di `app/Http/Requests/`, berakhiran `Request.php`, meng-extend `FormRequest`.
**Tanggung Jawab:** Memeriksa hak akses (`authorize`), memeriksa batasan input (`rules`), dan validasi logika tambahan (`after`).

```php
namespace App\Http\Requests;

class StoreFeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isActive() === true;
    }

    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'integer', 'exists:facilities,id'],
            'keterangan' => ['required', 'string', 'max:255'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($kondisiTidakValid) {
                    $validator->errors()->add('field', 'Pesan error khusus');
                }
            }
        ];
    }
}
```

---

### Archetype 3: The Eloquent Model (Pola Entitas Data)
**Ciri Khas File:** Berada di `app/Models/`, mewarisi `Model` atau `Authenticatable`.
**Tanggung Jawab:** Menghubungkan kelas PHP dengan tabel database, mendefinisikan relasi (`belongsTo`, `hasMany`), dan casting tipe data.

```php
namespace App\Models;

#[Fillable(['name', 'status', 'user_id'])]
class Feature extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'status' => FeatureStatus::class,
            'created_at' => 'datetime',
        ];
    }
}
```

---

### Archetype 4: The Domain Service (Pola Otak Bisnis)
**Ciri Khas File:** Berada di `app/Services/`, berakhiran `Service.php`.
**Tanggung Jawab:** Menjalankan algoritma murni yang tidak boleh tercampur di controller (misal deteksi tumpang tindih waktu, penguncian baris database, ekspor PDF/Excel).

```php
namespace App\Services;

class FeatureConflictService
{
    public function checkConflict(int $resourceId, Carbon $start, Carbon $end): bool
    {
        return Model::query()
            ->where('resource_id', $resourceId)
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start)
            ->lockForUpdate() // Pessimistic Lock
            ->exists();
    }
}
```

---

### Archetype 5: The React Page Component (Pola Tampilan Klien)
**Ciri Khas File:** Berada di `resources/js/pages/`, berakhiran `.tsx`.
**Tanggung Jawab:** Menerima props dari controller, mengelola interaksi visual, dan mengirimkan aksi kembali ke server.

```tsx
import { Head, useForm } from '@inertiajs/react';

type Props = {
    items: Array<{ id: number; name: string }>;
    flash: { success?: string };
};

export default function FeaturePage({ items, flash }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/feature');
    };

    return (
        <div>
            <Head title="Kelola Fitur" />
            <form onSubmit={handleSubmit}>
                <input 
                    value={data.name} 
                    onChange={e => setData('name', e.target.value)} 
                />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
                <button disabled={processing}>Simpan</button>
            </form>
        </div>
    );
}
```

---

## 6. BAB 5: BEDAH KASUS NYATA BARIS-DEMI-BARIS (LINE-BY-LINE ANNOTATION)

Mari kita bedah satu alur pengajuan reservasi nyata dari codebase AduPDF baris-demi-baris secara mendalam.

### 6.1 Bedah File 1: [`app/Http/Controllers/ReservationController.php`](file:///B:/0000_UNDIP/5.%20SMT%205/PPK_PROJECTS/AduPDF_Local/AduPDF/app/Http/Controllers/ReservationController.php) (Metode `store`)

Mari kita bedah baris 50 hingga 80 dari controller ini:

```php
50: public function store(StoreReservationRequest $request): RedirectResponse
51: {
52:     $input = $request->validated();
53:     $rawSchedules = $request->input('schedules');
54:     $schedules = ! empty($rawSchedules) ? json_decode($rawSchedules, true) : null;
55: 
56:     if (is_array($schedules) && count($schedules) > 0) {
57:         DB::transaction(function () use ($request, $input, $schedules) {
58:             foreach ($schedules as $sched) {
59:                 Reservation::create([
60:                     'user_id' => $request->user()->id,
61:                     'facility_id' => $input['facility_id'],
62:                     'tujuan' => $input['tujuan'],
63:                     'start_time' => CarbonImmutable::parse("{$sched['date']}T{$sched['start_time']}", 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
64:                     'end_time' => CarbonImmutable::parse("{$sched['date']}T{$sched['end_time']}", 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
65:                     'status' => ReservationStatus::Pending,
66:                 ]);
67:             }
68:         });
69:     } else {
70:         Reservation::create([
71:             'user_id' => $request->user()->id,
72:             'facility_id' => $input['facility_id'],
73:             'tujuan' => $input['tujuan'],
74:             'start_time' => CarbonImmutable::parse($input['start_time'], 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
75:             'end_time' => CarbonImmutable::parse($input['end_time'], 'Asia/Jakarta')->utc()->format('Y-m-d H:i:s'),
76:             'status' => ReservationStatus::Pending,
77:         ]);
78:     }
79: 
80:     return redirect()->route('reservations.create', ['facility_id' => $input['facility_id']])
81:         ->with('success', 'Reservasi berhasil diajukan.');
82: }
```

#### Anotasi Rinci Baris-demi-Baris:
- **Baris 50 (`public function store(StoreReservationRequest $request): RedirectResponse`)**:
  - `store`: Nama metode aksi untuk menangani HTTP POST `/reservations`.
  - `StoreReservationRequest $request`: **Dependency Injection & Gatekeeper**. Sebelum baris 51 sempat dieksekusi, Laravel secara otomatis menjalankan validasi di `StoreReservationRequest`. Jika input tidak sah, eksekusi langsung dibatalkan di sini dan dialihkan kembali ke browser dengan pesan error.
  - `: RedirectResponse`: Return type declaration yang menjamin fungsi ini harus mengembalikan objek redirect HTTP.
- **Baris 52 (`$input = $request->validated();`)**:
  - Mengambil array asosiatif berisi data input yang **hanya dan pasti** telah lolos validasi (`facility_id`, `tujuan`, dll). Mencegah eksploitasi parameter liar.
- **Baris 53 (`$rawSchedules = $request->input('schedules');`)**:
  - Membaca input opsional `schedules` yang dikirim dari form klien berupa string JSON jika pengguna memilih banyak slot tanggal sekaligus (*bulk reservation*).
- **Baris 54 (`$schedules = ! empty($rawSchedules) ? json_decode($rawSchedules, true) : null;`)**:
  - Menggunakan operator ternary. Jika `$rawSchedules` tidak kosong, string JSON diubah menjadi array asosiatif PHP (`true`). Jika kosong, bernilai `null`.
- **Baris 56 (`if (is_array($schedules) && count($schedules) > 0)`)**:
  - Memeriksa apakah ini reservasi jam massal (*multi-date*).
- **Baris 57 (`DB::transaction(function () use ($request, $input, $schedules) {`)**:
  - **Integritas Database Transaksional (ACID)**: Membuka transaksi database via PDO (`$pdo->beginTransaction()`).
  - `function () use (...)`: Closure yang mengimpor variabel luar (`$request`, `$input`, `$schedules`) ke dalam scope transaksi.
  - *Dampak:* Jika ada 5 slot jadwal dan slot ke-4 gagal dibuat, 3 slot pertama otomatis dibatalkan (*rollback* total), sehingga database tidak mengalami inkonsistensi data setengah jadi.
- **Baris 58 (`foreach ($schedules as $sched)`)**:
  - Melakukan iterasi untuk setiap slot jadwal yang dipilih user.
- **Baris 59-66 (`Reservation::create([...])`)**:
  - Memanggil metode static Eloquent untuk melakukan `INSERT` ke database.
  - `CarbonImmutable::parse(...)->utc()->format(...)`: Mengonversi jam lokal WIB (`Asia/Jakarta`) ke format standar internasional UTC sebelum disimpan ke database, menjamin keseragaman zona waktu server.
  - `'status' => ReservationStatus::Pending`: Menetapkan status awal peminjaman menggunakan Backed Enum, bukan string mentah.
- **Baris 80-81 (`return redirect()->route(...)->with('success', ...)`)**:
  - Mengarahkan kembali pengguna ke halaman form reservasi dengan pesan kilat (*flash message*) dalam sesi bernama `'success'`, yang akan ditangkap oleh komponen Toast di React.

---

### 6.2 Bedah File 2: [`resources/js/pages/reservations/create.tsx`](file:///B:/0000_UNDIP/5.%20SMT%205/PPK_PROJECTS/AduPDF_Local/AduPDF/resources/js/pages/reservations/create.tsx) (State & Navigasi Klien)

Mari kita bedah baris 67 hingga 95 pada komponen React ini:

```typescript
67: export default function CreateReservation({ facility, reservable, success, server_now }: Props) {
68:     const { url } = usePage();
69:     const serverTimestamp = new Date(server_now).getTime();
70:     const [currentWib, setCurrentWib] = useState(() => currentWibDateTime(new Date(serverTimestamp)));
71:     const minimumStartTime = nextWibSlot(currentWib.time);
72:     const todayUnavailable = minimumStartTime > '19:30';
...
86:     const searchString = url.includes('?') ? url.split('?')[1] : (typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '');
87:     const params = new URLSearchParams(searchString);
88:     const requestedStart = params.get('start_time') ?? '';
```

#### Anotasi Rinci Baris-demi-Baris:
- **Baris 67 (`export default function CreateReservation({ facility, reservable, success, server_now }: Props)`)**:
  - Komponen fungsi React utama yang diekspor sebagai default.
  - Menerima 4 properti dari controller Laravel melalui Inertia, yang telah divalidasi oleh tipe TypeScript `Props`.
- **Baris 68 (`const { url } = usePage();`)**:
  - Menggunakan hook `usePage()` dari Inertia untuk membaca path URL halaman yang sedang aktif di memori klien.
- **Baris 69-70 (`useState(() => currentWibDateTime(...))`)**:
  - Menginisialisasi state lokal `currentWib` dengan *lazy initialization function* (hanya dieksekusi sekali saat komponen pertama kali dimuat).
  - Menggunakan waktu server (`server_now`) sebagai acuan jam, bukan jam laptop user (untuk mencegah kecurangan user memundurkan jam laptopnya).
- **Baris 71-72**:
  - Melakukan kalkulasi logika bisnis di klien: mencari slot 30 menit berikutnya, dan jika jam sudah melewati batas operasional (19:30), menyetel flag `todayUnavailable = true`.
- **Baris 86-88**:
  - Memanfaatkan **Browser Object Model (BOM)** `window.location` dan kelas bawaan JavaScript `URLSearchParams` untuk mengekstrak parameter query URL seperti `?start_time=2026-10-15T08:00`.
  - Operator `?? ''`: Jika parameter tidak ada di URL, gunakan string kosong sebagai default tanpa menghasilkan error `null`.

---

## 7. BAB 6: LEMBAR CONTEKAN CEPAT SIMBOL & OPERATOR (THE CHEAT SHEET MATRIX)

Tabel berikut adalah kamus cepat ketika Anda menemukan simbol atau operator yang tampak asing di codebase:

| Simbol / Operator | Nama Operator | Lingkungan | Arti & Cara Kerja | Contoh di Codebase AduPDF |
| :--- | :--- | :--- | :--- | :--- |
| `->` | Object Operator | PHP | Mengakses metode atau properti dari sebuah objek instansiasi | `$request->user()`, `$facility->name` |
| `::` | Scope Resolution | PHP | Mengakses konstanta, enum, atau metode statis dari sebuah kelas | `Reservation::create()`, `ReservationStatus::Pending` |
| `=>` | Double Arrow | PHP / JS | Pasangan key-value pada array PHP, atau body dari arrow function | `['key' => 'val']`, `(e) => setData(...)` |
| `??` | Null Coalescing | PHP & JS | Mengembalikan nilai kanan jika nilai kiri adalah `null` atau `undefined` | `$a ?? 'default'`, `params.get('id') ?? 0` |
| `?.` | Optional Chaining | PHP & JS | Mengakses properti anak secara aman tanpa error jika induknya bernilai null | `$user?->isAdmin()`, `facility?.location` |
| `...` | Spread / Rest | PHP & JS | Memecah elemen array/objek atau mengumpulkan parameter variabel | `[...prev, item]`, `...parent::share($request)` |
| `#[...]` | Attribute | PHP 8 | Metadata deklaratif penanda konfigurasi model atau rute | `#[Fillable([...])]`, `#[Hidden([...])]` |
| `fn()` | Arrow Function | PHP 8 | Fungsi anonim satu baris yang otomatis membaca variabel dari scope luar | `$urls->map(fn ($id) => ...)` |
| `use ()` | Closure Binding | PHP | Membawa variabel dari luar masuk ke dalam fungsi anonim multi-baris | `function () use ($request) { ... }` |
| `<T>` | Generics | TypeScript / PHPDoc | Tipe data fleksibel yang ditentukan saat pemanggilan | `Set<() => void>`, `Collection<int, Reservation>` |
| `e.preventDefault()` | Prevent Default | JS / DOM | Menghentikan aksi standar browser (seperti reload saat form dikirim) | `onSubmit={(e) => { e.preventDefault(); ... }}` |
| `compact()` | Compact Function | PHP | Mengubah nama variabel string menjadi array asosiatif | `compact('reservations', 'facilities')` |
| `values()` | Collection Values | PHP | Mengatur ulang urutan index array numerik menjadi `[0, 1, 2...]` | `$reservations->map(...)->values()` |
| `with()` | Eager Loading | PHP / Laravel | Memuat relasi tabel database secara bersamaan untuk mencegah masalah N+1 | `Reservation::with('facility:id,name')` |
| `tap()` | Tap Helper | PHP / Laravel | Menjalankan closure pada sebuah nilai lalu mengembalikan nilai tersebut | `tap($user)->update([...])` |

---
*Panduan ini disusun untuk memberikan pemahaman menyeluruh terhadap setiap baris kode di proyek AduPDF. Simpan panduan ini sebagai buku saku referensi utama saat Anda menelusuri repositori.*
