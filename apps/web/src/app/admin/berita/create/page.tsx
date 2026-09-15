import { Button } from "@superapp/ui";
import Link from "next/link";

export default function CreateBeritaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 gap-4">
        <Link href="/admin/berita" className="text-slate-500 hover:text-slate-700">
          ← Kembali
        </Link>
        <h1 className="text-3xl font-bold">Tulis Berita Baru</h1>
      </div>

      <form className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Judul Berita</label>
          <input 
            type="text" 
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent"
            placeholder="Masukkan judul berita..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input 
            type="text" 
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent"
            placeholder="masukkan-judul-berita"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Konten</label>
          <textarea 
            rows={10}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent"
            placeholder="Isi konten berita..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" className="bg-slate-200 text-slate-800 hover:bg-slate-300">Simpan Draf</Button>
          <Button type="submit">Terbitkan Berita</Button>
        </div>
      </form>
    </div>
  );
}
