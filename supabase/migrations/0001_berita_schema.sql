-- 0001_berita_schema.sql

-- 1. Table: Berita Kategori
CREATE TABLE public.berita_kategori (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: Berita
CREATE TABLE public.berita (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    cover_image_url TEXT,
    category_id UUID REFERENCES public.berita_kategori(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_berita_updated_at
BEFORE UPDATE ON public.berita
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 3. Storage Bucket for Berita (dokumen)
INSERT INTO storage.buckets (id, name, public) VALUES ('dokumen', 'dokumen', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Public can view, Admin can manage)
CREATE POLICY "Public Access Dokumen" ON storage.objects
FOR SELECT USING (bucket_id = 'dokumen');

CREATE POLICY "Admin Manage Dokumen" ON storage.objects
FOR ALL USING (bucket_id = 'dokumen' AND public.has_permission('berita.manage'));

-- 4. RLS for Tables
ALTER TABLE public.berita_kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;

-- Kategori: Select for all, Manage for Admin
CREATE POLICY "Kategori Select All" ON public.berita_kategori FOR SELECT USING (true);
CREATE POLICY "Kategori Manage Admin" ON public.berita_kategori FOR ALL USING (public.has_permission('berita.manage'));

-- Berita: Select published for all, Select all & Manage for Admin
CREATE POLICY "Berita Select Published" ON public.berita FOR SELECT USING (status = 'published');
CREATE POLICY "Berita Select Admin" ON public.berita FOR SELECT USING (public.has_permission('berita.manage'));
CREATE POLICY "Berita Manage Admin" ON public.berita FOR ALL USING (public.has_permission('berita.manage'));

-- 5. Insert Required Permission
INSERT INTO public.permissions (action, description) VALUES ('berita.manage', 'Mengelola berita dan kategori (CRUD)') ON CONFLICT DO NOTHING;
