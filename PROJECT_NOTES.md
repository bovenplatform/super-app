# 📝 Catatan Proyek & Daftar Periksa (PROJECT NOTES)

File ini digunakan untuk mencatat *checklist* fitur, kendala (bugs/issues) yang ditemukan selama masa pengembangan, beserta solusi teknis yang telah diterapkan agar tidak terjadi pengulangan kesalahan (regresi).

## 🗂️ Checklist Scaffolding Awal
- [x] Inisiasi direktori utama.
- [ ] Inisiasi Turborepo dan Pnpm Workspace.
- [ ] Pembuatan `packages/ui`, `config`, `utils`, `types`, `validations`.
- [ ] Instalasi Next.js 16 di `apps/web`.
- [ ] Pembuatan struktur rute `(public)` dan `admin`.
- [ ] Seting Supabase lokal / inisialisasi skema awal (RBAC & Roles).
- [ ] Konfigurasi Tailwind + Dark Mode via CSS variables.

---

## 🐞 Log Isu & Solusi (Issue Logs)

### Isu 1: Keamanan Penggabungan Admin & Publik di Satu Aplikasi
* **Gejala / Kendala**: Klien khawatir penggabungan `apps/web` (Publik & Admin) berisiko dari sisi keamanan, memengaruhi data rahasia.
* **Solusi Diterapkan**: 
  - Menerapkan **Arsitektur Pertahanan 3-Lapis (3-Layer Defense)**.
  - Memastikan *Middleware* mencegat *route* `/admin`.
  - Pengecekan Supabase RLS di tingkat database.
  - Penggunaan *Dual-Bucket Storage* memisahkan bucket dokumen publik dan dokumen privat. (Direferensikan di `AGENTS.md`).
* **Tanggal Penyelesaian**: *Dalam proses implementasi (Fase Scaffolding)*.

### Isu 2: (Template Isu Berikutnya)
* **Gejala / Kendala**: ...
* **Solusi Diterapkan**: ...
* **Tanggal Penyelesaian**: ...
