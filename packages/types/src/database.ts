export type BeritaStatus = 'draft' | 'published' | 'archived';

export interface BeritaKategori {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface Berita {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    cover_image_url: string | null;
    category_id: string | null;
    author_id: string | null;
    status: BeritaStatus;
    created_at: string;
    updated_at: string;
    
    // Virtual or joined fields
    kategori?: BeritaKategori;
}

export type Database = {
    public: {
        Tables: {
            berita_kategori: {
                Row: BeritaKategori;
                Insert: Partial<BeritaKategori>;
                Update: Partial<BeritaKategori>;
            };
            berita: {
                Row: Berita;
                Insert: Partial<Berita>;
                Update: Partial<Berita>;
            };
        }
    }
};
