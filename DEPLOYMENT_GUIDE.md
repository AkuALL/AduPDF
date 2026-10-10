# Panduan Deployment Laravel + Inertia React di Railway

Dokumen ini berisi rangkuman langkah komprehensif untuk men-deploy aplikasi Laravel (dengan Inertia.js React/TypeScript) ke platform cloud Railway secara bersih dan andal.

---

## 1. Persiapan Kode di Lokal (Sebelum Masuk ke Railway)

Pastikan 4 penyesuaian berikut sudah ada di repositori lokalmu sebelum di-push ke GitHub:

### A. Kunci Versi Runtime via `mise.toml`
Railway menggunakan builder *Railpack*. Buat file `mise.toml` di root proyek agar sistem menggunakan versi runtime yang sesuai dan tidak jatuh ke versi lawas:
```toml
[tools]
php = "8.4"
node = "22"
```

### B. Konfigurasi Runner via `railway.json`
Menjalankan server bawaan Laravel (`artisan serve`) jauh lebih stabil di Railway dibanding konfigurasi Nginx manual karena menghindari konflik soket FastCGI, MIME types, dan routing:
```json
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "NIXPACKS"
    },
    "deploy": {
        "startCommand": "php artisan serve --host=0.0.0.0 --port=$PORT",
        "releaseCommand": "php artisan migrate --force"
    }
}
```

### C. Trust Reverse Proxy di `bootstrap/app.php`
Karena Railway menjalankan container di balik reverse proxy HTTPS, Laravel perlu diberi tahu untuk memercayai header proxy agar aset tidak diblokir oleh browser (*Mixed Content*):
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: '*');
    // ...
})
```

### D. Paksa Skema HTTPS di `app/Providers/AppServiceProvider.php`
Di dalam method `boot()`, pastikan URL aset digenerate menggunakan protokol HTTPS saat di cloud:
```php
public function boot(): void
{
    if (app()->environment('production') || ! empty(env('RAILWAY_ENVIRONMENT'))) {
        \Illuminate\Support\Facades\URL::forceScheme('https');
    }

    // ...
}
```

> **Commit & Push:** Pastikan semua perubahan di atas di-commit dan di-push ke branch utama repositori GitHub.

---

## 2. Setup Project & Database di Dashboard Railway

1. Buka [Railway](https://railway.com) dan buat **New Project**.
2. Pilih **Deploy from GitHub repo**, lalu sambungkan ke repositori aplikasimu.
3. Tambahkan Database:
   * Tekan shortcut `Ctrl + K` (atau tombol **`+`** di kanvas).
   * Pilih menu **Database** -> **Add PostgreSQL**.
   > **Catatan Penting:** PostgreSQL direkomendasikan dibandingkan MySQL di cloud container Railway karena tidak memiliki kendala plugin autentikasi (`caching_sha2_password`) pada driver bawaan PHP.

---

## 3. Konfigurasi Environment Variables di Railway

Buka kotak aplikasi Laravel-mu di Railway, lalu masuk ke tab **Variables** dan tambahkan variabel-variabel berikut:

### Konfigurasi Aplikasi:
- `APP_KEY`: *(Salin nilai `APP_KEY` dari file `.env` lokal)*
- `APP_ENV`: `production`
- `APP_DEBUG`: `false`
- `APP_URL`: `https://<domain-aplikasi-kamu>.up.railway.app`

### Konfigurasi Database (PostgreSQL):
- `DB_CONNECTION`: `pgsql`
- `DB_HOST`: `${{Postgres.PGHOST}}`
- `DB_PORT`: `5432`
- `DB_DATABASE`: `${{Postgres.PGDATABASE}}`
- `DB_USERNAME`: `${{Postgres.PGUSER}}`
- `DB_PASSWORD`: `${{Postgres.PGPASSWORD}}`

*(Sintaks `${{Postgres...}}` adalah fitur referensi otomatis Railway yang akan mengambil data dari kotak database Postgres).*

---

## 4. Konfigurasi Domain (Networking)

1. Masuk ke tab **Settings** pada kotak aplikasi.
2. Gulir ke bagian **Networking** / **Public Networking**.
3. Klik tombol **Generate Domain** untuk mendapatkan URL publik (misal: `adupdf-production.up.railway.app`).
4. Pastikan port diarahkan ke port yang sesuai jika diminta (atau biarkan default mengikuti `$PORT`).

---

## 5. Migrasi & Seeding Awal (First Run)

Setelah container berhasil aktif:
1. Buka tab **Console** pada kotak aplikasi di Railway.
2. Jalankan perintah migrasi skema sekaligus akun demo:
   ```bash
   php artisan migrate --seed --force
   ```
3. Tunggu hingga proses selesai. Buka domain publik aplikasimu di browser. Website sudah online dan siap digunakan.
