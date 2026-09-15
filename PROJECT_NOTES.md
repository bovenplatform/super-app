# 📝 Catatan Proyek & Daftar Periksa (PROJECT NOTES)

File ini digunakan untuk mencatat *checklist* fitur, kendala (bugs/issues) yang ditemukan selama masa pengembangan, beserta solusi teknis yang telah diterapkan agar tidak terjadi pengulangan kesalahan (regresi).

## 🗂️ Checklist Scaffolding & Audit Hardening
- [x] Inisiasi direktori utama.
- [x] Inisiasi Turborepo dan Pnpm Workspace.
- [x] Pembuatan `packages/ui`, `config`, `utils`, `types`, `validations`.
- [x] Konfigurasi Next.js App Router di `apps/web`.
- [x] Pembuatan struktur rute `(public)`, `admin`, dan `akun` (Guest Portal).
- [x] Seting Supabase & Migrasi Penguatan RLS (`0004_security_hardening.sql`).
- [x] Konfigurasi Tailwind + Dark Mode via CSS variables.
- [x] Standardisasi Supabase 4-Tier Client Architecture & Dual API Keys (2026+).
- [x] Konfigurasi Pipeline Monorepo (Turbo Typecheck & ESLint across all packages).
- [x] SEO (Robots, Sitemap, Metadata) & PWA Web App Manifest.

---

## 🐞 Log Isu & Solusi (Issue Logs)

### Isu 1: Keamanan Penggabungan Admin & Publik di Satu Aplikasi
* **Gejala / Kendala**: Kekhawatiran penggabungan `apps/web` (Publik & Admin) berisiko dari sisi keamanan dan eskalasi hak akses data privat.
* **Solusi Diterapkan**: 
  - Menerapkan **Arsitektur Pertahanan 3-Lapis (3-Layer Defense)**.
  - Memastikan *Middleware* mencegat *route* `/admin`.
  - Pengecekan Supabase RLS di tingkat database pada semua tabel RBAC (`0004_security_hardening.sql`).
  - Penggunaan *Dual-Bucket Storage* (`dokumen` publik dan `secure-docs` privat).
* **Tanggal Penyelesaian**: 15 September 2026.

### Isu 2: Online Crash (500 Server Exception) di Vercel (Digest: 452269709)
* **Gejala / Kendala**: Halaman `/admin` di production Vercel (`https://super-app-web-gray.vercel.app/admin`) mengalami error 500 unhandled server exception.
* **Penyebab Akar (Root Cause)**:
  1. `guardAdminPage()` dan Supabase middleware memanggil `supabase.auth.getUser()` tanpa penanganan error (try/catch) dan tanpa validasi kesiapan URL/kredensial Supabase.
  2. Saat environment variable belum disinkronkan di Vercel atau bernilai default `http://localhost:3000`, pemanggilan `fetch` jaringan di serverless runtime gagal fatal (`TypeError: fetch failed`) dan melempar *unhandled exception*.
  3. OAuth callback langsung mengarahkan pengguna ke `/admin` tanpa mengecek role user, sehingga memicu *account locked* dan error redirect loop.
* **Solusi Diterapkan**:
  1. Dibuat helper `apps/web/src/lib/supabase/env.ts` untuk validasi `isSupabaseConfigured()`, normalisasi URL, dan fallback dual key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  2. Dibungkus seluruh pemanggilan auth di `guardAdminPage()`, `getRbacUser()`, dan middleware ke dalam blok `try...catch` yang mengalihkan user secara aman ke `/login` atau `/akun` tanpa memicu crash server 500.
  3. Disediakan portal khusus tamu `/akun` (*Smart Auth Routing*) sehingga pengguna non-admin dialihkan ke portal publik yang aman.
* **Tanggal Penyelesaian**: 15 September 2026.
