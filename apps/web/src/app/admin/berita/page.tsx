import Link from "next/link";
import { Button } from "@superapp/ui";

export default function AdminBeritaPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kelola Berita</h1>
        <Link href="/admin/berita/create">
          <Button>+ Tulis Berita</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4 font-medium text-slate-500">Judul Berita</th>
              <th className="p-4 font-medium text-slate-500">Kategori</th>
              <th className="p-4 font-medium text-slate-500">Status</th>
              <th className="p-4 font-medium text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            <tr>
              <td className="p-4" colSpan={4}>
                <div className="text-center py-8 text-slate-500">
                  Belum ada berita. (Simulasi UI Static)
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
