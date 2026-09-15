import { guardAdminPage } from "@/lib/rbac";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Berita } from "@superapp/types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@superapp/ui";
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
      {/* 1. Page Header */}
      <PageHeader
        title="Kelola Berita & Publikasi"
        description="Manajemen artikel berita, pengumuman kegiatan, dan konten portal publik."
        action={
          <Link href="/admin/berita/create">
            <Button>+ Tulis Berita Baru</Button>
          </Link>
        }
      />

      {/* 2. Success message banner */}
      {message === "created" && (
        <div className="p-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg border border-emerald-500/30">
          Berita baru berhasil diterbitkan dan disinkronkan ke portal publik!
        </div>
      )}

      {/* 3. Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-xs">
          <Input placeholder="Cari judul berita..." />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-muted">
          <span>Total: <strong className="text-main">{beritaList.length}</strong> artikel</span>
        </div>
      </Card>

      {/* 4. Unified Data Table */}
      {beritaList.length === 0 ? (
        <EmptyState
          title="Belum Ada Berita di Database"
          description="Mulai publikasikan konten pertama untuk portal organisasi Anda."
          action={
            <Link href="/admin/berita/create">
              <Button>+ Tulis Berita Pertama</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Berita</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beritaList.map((item) => {
                const kategoriName =
                  (item.kategori as unknown as { name?: string })?.name || "-";
                const dateStr = new Date(item.created_at).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "short", year: "numeric" }
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-main">
                      <Link
                        href={`/berita/${item.slug}`}
                        target="_blank"
                        className="hover:text-primary transition hover:underline"
                      >
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted">{kategoriName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "published"
                            ? "success"
                            : item.status === "draft"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted">{dateStr}</TableCell>
                    <TableCell className="text-right">
                      <form
                        action={async () => {
                          "use server";
                          await deleteBeritaAction(item.id);
                        }}
                        className="inline"
                      >
                        <Button
                          variant="destructive"
                          size="sm"
                          type="submit"
                          className="text-xs h-7 px-2.5"
                        >
                          Hapus
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* 5. Pagination */}
          <Pagination
            currentPage={1}
            totalPages={1}
            totalItems={beritaList.length}
          />
        </div>
      )}
    </div>
  );
}
