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
   Wajib menggunakan fungsi *helper* seperti `guardAdminPage()` yang akan me-lempar error/redirect jika User Role tidak memiliki *permission* yang memadai. **Jangan pernah *fetch* data rahasia sebelum memanggil guard ini.**
3. **Layer Database (Supabase RLS)**:
   Semua query tabel wajib dilindungi *Row Level Security* menggunakan fungsi PostgreSQL pembantu seperti `has_permission('module.action')`.
4. **Isolasi Dokumen (Dual-Bucket)**:
   - Bucket `dokumen` (Publik): Hanya untuk berita, banner, logo.
   - Bucket `secure-docs` (Privat): Untuk KTP, KK, Surat Keputusan internal. Akses HARUS melalui *Signed URL* (berlaku terbatas).

---

## 3. ATURAN GOOGLE OAUTH & SUPABASE SSR (ANTI-ERROR PKCE & 500)
1. **Inisiasi OAuth Wajib Client-Side (`"use client"`)**:
   - Pemicu Google OAuth WAJIB menggunakan Client Component yang memanggil `getSupabaseBrowser().auth.signInWithOAuth(...)`.
   - **DILARANG** memicu `signInWithOAuth` dari Server Action (`"use server"`), karena *redirect 307* ke Google akan menghilangkan cookie PKCE verifier di browser dan memicu error *"PKCE code verifier not found in storage"*.
2. **Dual-Cookie Adapter Compatibility**:
   - `createServerClient` wajib mengimplementasikan adapter cookie klasik (`get`, `set`, `remove`) dan modern (`getAll`, `setAll`) secara simultan di `createServerSupabase()`, `middleware.ts`, dan `/auth/callback`.
3. **Smart Auth Routing (Auto-Guest)**:
   - Di `/auth/callback/route.ts`, setelah menukar `code` menjadi sesi:
     - Jika pengguna memiliki role admin aktif (`is_active = true`) &rarr; redirect ke `/admin`.
     - Jika pengguna umum/tamu (`role = null` atau `is_active = false`) &rarr; redirect ke `/akun` (Portal Pengguna Publik).
4. **Fail-Safe Try-Catch Protection**:
   - Seluruh pemanggilan `auth.getUser()` di server guards dan middleware WAJIB dibungkus blok `try...catch` agar tidak memicu HTTP 500 Server Exception saat environment variable belum disinkronkan.

---

## 4. DAFTAR KONFIGURASI MULTI-PLATFORM (GOOGLE, SUPABASE, VERCEL)

### A. Google Cloud Console (`console.cloud.google.com`)
- **Authorized JavaScript origins**: `http://localhost:3000`, `https://nama-aplikasi.vercel.app`
- **Authorized redirect URIs**:
  - `https://[PROJECT_REF].supabase.co/auth/v1/callback` *(Krusial: Callback Supabase)*
  - `http://localhost:3000/auth/v1/callback`
  - `http://localhost:3000/auth/callback`
  - `https://nama-aplikasi.vercel.app/auth/callback`

### B. Supabase Dashboard (`supabase.com/dashboard`)
- **Authentication &rarr; Providers &rarr; Google**: Toggle **ON**, isi `Client ID` dan `Client Secret`.
- **Authentication &rarr; URL Configuration**:
  - `Site URL`: `https://nama-aplikasi.vercel.app`
  - `Redirect URLs`: `http://localhost:3000/**`, `https://nama-aplikasi.vercel.app/**`

### C. Vercel Dashboard (`vercel.com`)
- `NEXT_PUBLIC_SUPABASE_URL` = `https://[PROJECT_REF].supabase.co` (*Config / Plain Text*)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_...` (*Config / Plain Text*)
- `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_...` (*Secret / Sensitive*)
- `NEXT_PUBLIC_SITE_URL` = `https://nama-aplikasi.vercel.app` (*Config / Plain Text*)

---

## 5. ATURAN STYLING & UI
- **Tailwind CSS Utama**. Warna *dark/light mode* diselesaikan via CSS Variables di root globals, BUKAN dengan class panjang-lebar seperti `text-gray-900 dark:text-white` di setiap tag.
- Render komponen kustom melalui package `@superapp/ui`.
- **Hydration Mismatch Rule**: `Badge`, `Button` inline wajib berupa elemen `<span>` atau `<button>`, jangan menggunakan `<div>` di dalam `<p>` atau semacamnya.

---

## 6. FITUR MODULAR (FEATURE FLAGS)
Karena ini adalah Super-App Template, modul-modul berikut disiapkan untuk dihidupkan/dimatikan berdasarkan kebutuhan klien:
- `MODUL_SURAT` (Surat Masuk/Keluar)
- `MODUL_INVENTARIS` (Aset & Mutasi)
- `MODUL_BERITA` (Media Artikel Publik)
- `MODUL_STRUKTUR` (Bagan Organisasi)
- `MODUL_SKM` (Survei Kepuasan Masyarakat)
Jika klien tidak butuh Surat, tombol menu dan route harus otomatis tersembunyi.
