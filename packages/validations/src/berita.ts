import { z } from "zod";

export const BeritaSchema = z.object({
  title: z.string().min(5, "Judul berita minimal 5 karakter").max(255),
  slug: z.string().min(3, "Slug wajib diisi"),
  category_id: z.string().uuid("Kategori tidak valid").optional().nullable(),
  content: z.string().min(10, "Konten berita tidak boleh terlalu singkat").optional().nullable(),
  cover_image_url: z.string().url("URL gambar tidak valid").optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type BeritaInput = z.infer<typeof BeritaSchema>;
