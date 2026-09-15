import type { AdminUser, Permission, Role, RolePermission } from "./rbac";

export type BeritaStatus = "draft" | "published" | "archived";

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
  kategori?: BeritaKategori | null;
}

export type Database = {
  public: {
    Tables: {
      berita_kategori: {
        Row: BeritaKategori;
        Insert: Partial<BeritaKategori>;
        Update: Partial<BeritaKategori>;
        Relationships: [];
      };
      berita: {
        Row: Berita;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          cover_image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: BeritaStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Berita>;
        Relationships: [
          {
            foreignKeyName: "berita_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "berita_kategori";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: Role;
        Insert: Partial<Role>;
        Update: Partial<Role>;
        Relationships: [];
      };
      permissions: {
        Row: Permission;
        Insert: Partial<Permission>;
        Update: Partial<Permission>;
        Relationships: [];
      };
      role_permissions: {
        Row: RolePermission;
        Insert: RolePermission;
        Update: Partial<RolePermission>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: Partial<AdminUser>;
        Update: Partial<AdminUser>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_permission: {
        Args: { required_action: string };
        Returns: boolean;
      };
      get_rbac_user: {
        Args: { user_email: string };
        Returns: {
          id: string;
          email: string;
          full_name: string;
          role: string | null;
          is_active: boolean;
          permissions: string[];
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
