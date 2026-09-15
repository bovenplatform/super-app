# 🤖 MASTER PROMPT & AI AGENT INSTRUCTIONS

File ini adalah **sumber kebenaran utama (Single Source of Truth)** untuk seluruh AI Model (Claude, GPT, Gemini, dsb) yang mengerjakan proyek "Super-App Template" ini. 

> **JANGAN MENGABAIKAN FILE INI.** Selalu rujuk aturan di sini sebelum melakukan implementasi fitur baru atau *refactoring*.

---

## 1. KONTEKS PROYEK & ARSITEKTUR
Proyek ini menggunakan **Turborepo** (`pnpm`), **Next.js 16 (App Router)**, dan **Supabase**. Arsitektur ini adalah fusi dari 3 proyek pendahulunya (BAZNAS, Kemenhaj, MWCNU). 
- **Semua komponen UI modular** berada di `packages/ui`.
- **Semua tipe data (Types/Interfaces/Enums)** berada di `packages/types`.
- **Semua skema validasi (Zod)** berada di `packages/validations`.
- **Semua utility function** berada di `packages/utils`.
- **Hanya spesifik halaman dan routing** yang berada di `apps/web`.

---

## 2. ATURAN KEAMANAN (MUTLAK)
Aplikasi publik dan admin disatukan di `apps/web`. Penggabungan ini aman **KARENA** kita menggunakan Sistem Keamanan 3-Lapis (3-Layer Defense). Anda WAJIB mematuhi aturan ini setiap kali membuat rute admin baru:

1. **Layer Middleware (`middleware.ts`)**:
   Mencegah akses belum terotentikasi ke `/admin/*`. Redirect tamu ke `/login`.
2. **Layer Server Guard (`layout.tsx` / `page.tsx` Server Component)**:
   Wajib menggunakan fungsi *helper* seperti `requireAdmin()` atau `guardAdminPage()` yang akan me-lempar error/redirect jika User Role tidak memiliki *permission* yang memadai. **Jangan pernah *fetch* data rahasia sebelum memanggil guard ini.**
3. **Layer Database (Supabase RLS)**:
   Semua query tabel wajib dilindungi *Row Level Security* menggunakan fungsi PostgreSQL pembantu seperti `has_permission('module.action')`.
4. **Isolasi Dokumen (Dual-Bucket)**:
   - Bucket `dokumen` (Publik): Hanya untuk berita, banner, logo.
   - Bucket `secure-docs` (Privat): Untuk KTP, KK, Surat Keputusan internal. Akses HARUS melalui *Signed URL* (berlaku terbatas).

---

## 3. ATURAN PENGEMBANGAN NEXT.JS 16
- **Server Components by Default**: Gunakan `"use client"` HANYA pada komponen leaf (ujung) yang butuh interaktivitas (onClick, useState). Layout dan Page WAJIB berupa Server Component.
- **Supabase SSR**: Selalu gunakan `@supabase/ssr` dengan pola:
  - `createServerClient` di dalam Page/Server Component untuk *data fetching*.
  - Kirim data via *props* ke Client Component (jika butuh state lokal).
  - Panggil `createBrowserClient` di Client Component hanya untuk proses mutasi (insert, update, delete).
- **Hindari Waterfall Fetching**: Gunakan `Promise.all()` jika melakukan lebih dari satu kueri *independent* di Server Component.

---

## 4. ATURAN STYLING & UI
- **Tailwind CSS Utama**. Warna *dark/light mode* diselesaikan via CSS Variables di root globals, BUKAN dengan class panjang-lebar seperti `text-gray-900 dark:text-white` di setiap tag.
- Render komponen kustom melalui package `@superapp/ui`.
- **Hydration Mismatch Rule**: `Badge`, `Button` inline wajib berupa elemen `<span>` atau `<button>`, jangan menggunakan `<div>` di dalam `<p>` atau semacamnya.

---

## 5. FITUR MODULAR (FEATURE FLAGS)
Karena ini adalah Super-App Template, modul-modul berikut disiapkan untuk dihidupkan/dimatikan berdasarkan kebutuhan klien:
- `MODUL_SURAT` (Surat Masuk/Keluar)
- `MODUL_INVENTARIS` (Aset & Mutasi)
- `MODUL_BERITA` (Media Artikel Publik)
- `MODUL_STRUKTUR` (Bagan Organisasi)
- `MODUL_SKM` (Survei Kepuasan Masyarakat)
Jika klien tidak butuh Surat, tombol menu dan route harus otomatis tersembunyi.
