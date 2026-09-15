import { guardAdminPage } from "@/lib/rbac";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Berita } from "@superapp/types";
import { Button } from "@superapp/ui";
import Link from "next/link";
import { deleteBeritaAction } from "./actions";

export default async function AdminBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  await guardAdminPage("berita.manage");
  const { message } = await searchParams;

  let beritaList: Berita[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("berita")
        .select("*, kategori:berita_kategori(name)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        beritaList = data as unknown as Berita[];
      }
    } catch (err) {
      console.error("Error fetching admin berita:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Kelola Berita & Publikasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen artikel berita, siaran pers, dan pengumuman publik
          </p>
        </div>
        <Link href="/admin/berita/create">
          <Button>+ Tulis Berita Baru</Button>
        </Link>
      </div>

      {message === "created" && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-sm rounded-lg border border-emerald-200 dark:border-emerald-800">
          Berita baru berhasil diterbitkan!
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  Judul Berita
                </th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  Kategori
                </th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                  Tanggal
                </th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {beritaList.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-slate-500" colSpan={5}>
                    <div className="max-w-sm mx-auto space-y-3">
                      <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                        Belum ada berita terdaftar di database.
                      </p>
                      <p className="text-xs text-slate-500">
                        Klik tombol &ldquo;+ Tulis Berita Baru&rdquo; di atas untuk mulai membuat publikasi pertama.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                beritaList.map((item) => {
                  const kategoriName =
                    (item.kategori as unknown as { name?: string })?.name || "-";
                  const dateStr = new Date(item.created_at).toLocaleDateString(
                    "id-ID",
                    { day: "numeric", month: "short", year: "numeric" }
                  );

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition"
                    >
                      <td className="p-4 font-medium text-slate-900 dark:text-white">
                        <Link
                          href={`/berita/${item.slug}`}
                          target="_blank"
                          className="hover:text-brand-emerald dark:hover:text-emerald-400 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-500">{kategoriName}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.status === "published"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                              : item.status === "draft"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">{dateStr}</td>
                      <td className="p-4 text-right">
                        <form
                          action={async () => {
                            "use server";
                            await deleteBeritaAction(item.id);
                          }}
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          >
                            Hapus
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
