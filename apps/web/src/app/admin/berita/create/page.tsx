import { guardAdminPage } from "@/lib/rbac";
import {
  Button,
  Card,
  FormField,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@superapp/ui";
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
      {/* 1. Page Header with Back Link */}
      <PageHeader
        title="Tulis Berita Baru"
        description="Lengkapi formulir di bawah ini untuk menerbitkan artikel berita ke portal publik."
        backHref="/admin/berita"
        backLabel="Kembali ke Kelola Berita"
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
          <strong>Gagal Menyimpan:</strong> {error}
        </div>
      )}

      {/* 2. Uniform Form Card Grid */}
      <form action={createBeritaAction}>
        <Card className="p-6 sm:p-8 space-y-6">
          <FormField
            label="Judul Berita"
            required
            description="Judul utama yang akan ditampilkan di header artikel dan kartu pratinjau."
            htmlFor="title"
          >
            <Input
              id="title"
              name="title"
              required
              placeholder="Contoh: Penyaluran Bantuan Program Beasiswa Pendidikan 2026"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              label="Slug URL"
              required
              description="Identitas URL artikel (huruf kecil & tanda hubung -)."
              htmlFor="slug"
            >
              <Input
                id="slug"
                name="slug"
                required
                placeholder="penyaluran-beasiswa-pendidikan-2026"
              />
            </FormField>

            <FormField
              label="Status Publikasi"
              required
              description="Tentukan apakah artikel langsung tampil atau disimpan sebagai draf."
              htmlFor="status"
            >
              <Select id="status" name="status" defaultValue="published">
                <option value="published">Langsung Publikasikan (Published)</option>
                <option value="draft">Simpan Draf (Draft)</option>
                <option value="archived">Arsipkan (Archived)</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label="URL Gambar Cover (Opsional)"
            description="Tautan gambar utama artikel (didukung format JPG, PNG, WEBP)."
            htmlFor="cover_image_url"
          >
            <Input
              id="cover_image_url"
              name="cover_image_url"
              type="url"
              placeholder="https://domain.com/gambar-cover.jpg"
            />
          </FormField>

          <FormField
            label="Konten Berita"
            required
            description="Tuliskan isi artikel berita secara lengkap dan jelas."
            htmlFor="content"
          >
            <Textarea
              id="content"
              name="content"
              rows={10}
              required
              placeholder="Tuliskan isi berita secara lengkap di sini..."
            />
          </FormField>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Link href="/admin/berita">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" variant="primary">
              Terbitkan Berita
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
