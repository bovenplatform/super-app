import { guardAdminPage } from "@/lib/rbac";
import { Button } from "@superapp/ui";
import Link from "next/link";
import { createBeritaAction } from "../actions";

export default async function CreateBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await guardAdminPage("berita.manage");
  const { error } = await searchParams;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/berita"
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm"
        >
          ← Kembali ke Kelola Berita
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tulis Berita Baru
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg text-sm">
          <strong>Gagal Menyimpan:</strong> {error}
        </div>
      )}

      <form
        action={createBeritaAction}
        className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            Judul Berita *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none"
            placeholder="Contoh: Penyaluran Bantuan Program Beasiswa Pendidikan 2026"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            Slug URL *
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none"
            placeholder="penyaluran-bantuan-beasiswa-2026"
          />
          <p className="text-xs text-slate-500 mt-1">
            Gunakan huruf kecil dan tanda hubung (-) tanpa spasi.
          </p>
        </div>

        <div>
          <label
            htmlFor="cover_image_url"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            URL Gambar Cover (Opsional)
          </label>
          <input
            id="cover_image_url"
            name="cover_image_url"
            type="url"
            className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none"
            placeholder="https://domain.com/gambar-berita.jpg"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
          >
            Konten Berita *
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none leading-relaxed"
            placeholder="Tuliskan isi berita secara lengkap di sini..."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Status Publikasi:
            </label>
            <select
              id="status"
              name="status"
              defaultValue="published"
              className="text-xs border border-slate-300 dark:border-slate-600 rounded p-1.5 bg-transparent"
            >
              <option value="published">Langsung Terbitkan (Published)</option>
              <option value="draft">Simpan sebagai Draf</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/berita">
              <Button
                type="button"
                className="bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
              >
                Batal
              </Button>
            </Link>
            <Button type="submit">Terbitkan Berita</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
