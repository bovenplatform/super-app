# 📝 Catatan Proyek & Daftar Periksa (PROJECT NOTES)

File ini digunakan untuk mencatat *checklist* fitur, kendala (bugs/issues) yang ditemukan selama masa pengembangan, beserta solusi teknis yang telah diterapkan agar tidak terjadi pengulangan kesalahan (regresi).

---

## 🎨 Master Plan & Standar Desain Seragam (Design System)

### 1. Prinsip Utama
- **Zero Hardcoded Colors**: Semua warna menggunakan semantic tokens CSS Variables (`var(--primary)`, `var(--bg-app)`, `var(--bg-surface)`, `var(--border-color)`). Rebranding klien hanya membutuhkan pergantian nilai di `globals.css`.
- **Keseragaman Antar Modul**: Seluruh modul backend/admin (Berita, User Management, Surat, Inventaris) wajib mengikuti layout blueprint yang sama (`PageHeader` -> `Card Filter/Search` -> `DataTable` -> `Pagination`).
- **Pemisahan Kumpulan Data vs Detail Data**:
  - Halaman Kumpulan Data Publik (Berita, Program): `max-w-7xl` dengan 3-Kolom Card Grid.
  - Halaman Detail Data Publik (Baca Berita, Profil): `max-w-4xl` dengan Single Column Reading Canvas.
  - Halaman Admin Listing (Tabel): `max-w-7xl` dengan responsive table & action bar.
  - Halaman Admin Form (Create/Edit): `max-w-4xl` dengan Card Form Grid & bottom action buttons.

---

## 🗂️ Checklist Scaffolding & Implementation
- [x] Inisiasi direktori utama & Turborepo Monorepo.
- [x] Pembuatan `packages/ui`, `config`, `utils`, `types`, `validations`.
- [x] Konfigurasi Next.js App Router di `apps/web`.
- [x] Pembuatan struktur rute `(public)`, `admin`, dan `akun` (Guest Portal).
- [x] Seting Supabase & Migrasi Penguatan RLS (`0004_security_hardening.sql`).
- [x] Standardisasi Supabase 4-Tier Client Architecture & Dual API Keys (2026+).
- [x] Konfigurasi Pipeline Monorepo (Turbo Typecheck & ESLint across all packages).
- [x] SEO (Robots, Sitemap, Metadata) & PWA Web App Manifest.
- [x] **Tahap 1 (Design Tokens)**: Semantic CSS Variables & Tailwind Theme Mapping.
- [ ] **Tahap 2 (UI Toolkit)**: PageHeader, DataTable, Pagination, FormField, Select, Checkbox, EmptyState di `@superapp/ui`.
- [ ] **Tahap 3 (Public Layout)**: Refactor Kumpulan Berita vs Detail Berita sesuai standar lebar.
- [ ] **Tahap 4 (Admin Layout & User Management)**: Refactor Admin Berita & Implementasi Admin User Management (`/admin/users`).
- [ ] **Tahap 5 (Verifikasi & Push)**: Typecheck, Build, Lint, dan Commit ke GitHub.

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
* **Gejala / Kendala**: Halaman `/admin` di production Vercel mengalami error 500 unhandled server exception.
* **Solusi Diterapkan**:
  - Dibuat helper `apps/web/src/lib/supabase/env.ts` untuk normalisasi URL & dual API key.
  - Seluruh pemanggilan auth dibungkus blok `try...catch` tahan-gagal (*fail-safe*).
  - Disediakan portal khusus tamu `/akun` (*Smart Auth Routing*).
* **Tanggal Penyelesaian**: 15 September 2026.

### Isu 3: PKCE Code Verifier Not Found in Storage
* **Gejala / Kendala**: Login Google memunculkan error *"PKCE code verifier not found in storage"*.
* **Solusi Diterapkan**:
  - Memindahkan inisiasi OAuth ke Client-Side (`GoogleLoginButton.tsx`) memanggil `getSupabaseBrowser().auth.signInWithOAuth(...)`.
  - Menerapkan *Dual-Cookie Adapter Compatibility* (`get`, `set`, `remove` & `getAll`, `setAll`) pada server Supabase client.
* **Tanggal Penyelesaian**: 15 September 2026.
