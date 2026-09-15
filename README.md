# Super-App Template (Modular Enterprise Boilerplate)

Boilerplate Enterprise grade berbasis **Next.js 16 (App Router)** dan **Turborepo** yang dirancang untuk menjadi pondasi sistem informasi, portal layanan publik, atau aplikasi manajemen organisasi (Ormas/Lembaga/Pemerintahan). Proyek ini menggabungkan fitur dan arsitektur terbaik dari sistem *BAZNAS*, *Kementerian Agama (Haji)*, dan *Tata Kelola Organisasi (MWCNU)*.

## 🚀 Fitur & Arsitektur Utama

- **Turborepo Monorepo**: Pemisahan logika ke dalam *packages* mandiri (`ui`, `config`, `types`, `validations`, `utils`) untuk kebersihan kode (*clean architecture*).
- **Aplikasi Terpadu (Single App, Multi-Layer)**: Aplikasi Web (Publik) dan Dasbor Admin berjalan dalam satu instance `apps/web` via *Route Groups* Next.js, menghemat *cost deployment* tanpa mengorbankan keamanan.
- **Keamanan RBAC 3-Lapis (3-Layer Defense)**:
  - **Level 1 (Middleware)**: Mencegah tamu (guest) masuk ke `/admin`.
  - **Level 2 (Server Component Guard)**: Pengecekan sesi & *role* yang mustahil di-bypass oleh klien.
  - **Level 3 (Database RLS - Row Level Security)**: Supabase PostgreSQL mengamankan data secara *low-level* berbasis `permission_ids`.
- **Dual-Bucket Storage**: Penyimpanan *Public CDN* untuk aset website, dan penyimpanan *Private* terenkripsi (Signed URL) untuk dokumen sensitif.

## 📁 Struktur Monorepo

```bash
brand_new/
├── apps/
│   └── web/               # Aplikasi utama Next.js 16 (Portal Publik & Admin)
├── packages/
│   ├── config/            # Konfigurasi ESLint, TypeScript, Prettier
│   ├── types/             # Definisi antarmuka (Interfaces), Enums, Tipe Database
│   ├── ui/                # Komponen antarmuka (Tailwind, Radix, Shadcn)
│   ├── utils/             # Helper universal (Format angka, tanggal, dsb.)
│   └── validations/       # Skema Zod untuk validasi Form dan API
└── supabase/
    └── migrations/        # Skema database & file migrasi SQL
```

## 🛠️ Stack Teknologi

- **Framework:** Next.js 16 App Router
- **Package Manager:** pnpm
- **Bahasa & Typing:** TypeScript
- **Styling:** Tailwind CSS + UI Components
- **Database & Auth:** Supabase (PostgreSQL, RLS, Storage)
- **Monorepo:** Turborepo

## 🏃 Memulai Pengembangan

1. Pastikan Anda telah menginstal `pnpm`:
   ```bash
   npm install -g pnpm
   ```
2. Instal seluruh *dependencies*:
   ```bash
   pnpm install
   ```
3. Copy `.env.example` ke `.env.local` di dalam folder `apps/web` dan atur kredensial Supabase Anda.
4. Jalankan *development server*:
   ```bash
   pnpm dev
   ```
