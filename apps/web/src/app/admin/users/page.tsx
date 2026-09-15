import { guardAdminPage } from "@/lib/rbac";
import { createAdminSupabase, createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AdminUser, Role } from "@superapp/types";
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
import { toggleUserStatusAction, updateUserRoleAction } from "./actions";

export default async function AdminUsersPage() {
  await guardAdminPage("system.manage");

  let users: (AdminUser & { role?: Role | null })[] = [];
  let roles: Role[] = [];

  if (isSupabaseConfigured()) {
    try {
      let supabase;
      try {
        supabase = createAdminSupabase();
      } catch {
        supabase = await createServerSupabase();
      }

      const [{ data: userData }, { data: roleData }] = await Promise.all([
        supabase
          .from("admin_users")
          .select("*, role:roles(*)")
          .order("created_at", { ascending: false }),
        supabase.from("roles").select("*").order("name"),
      ]);

      if (userData) {
        users = userData as unknown as (AdminUser & { role?: Role | null })[];
      }
      if (roleData) {
        roles = roleData as Role[];
      }
    } catch (err) {
      console.error("Error fetching users for admin:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Manajemen Pengguna & Otoritas"
        description="Kelola akun pengguna terdaftar, status aktivasi akses, dan penetapan role administrator sistem."
      />

      {/* 2. Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-xs">
          <Input placeholder="Cari nama pengguna..." />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-muted">
          <span>
            Total Pengguna: <strong className="text-main">{users.length}</strong>
          </span>
        </div>
      </Card>

      {/* 3. Unified Data Table */}
      {users.length === 0 ? (
        <EmptyState
          title="Belum Ada Pengguna di Database"
          description="Pengguna baru yang mendaftar via Google atau form registrasi akan otomatis muncul di tabel ini."
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Role / Hak Akses</TableHead>
                <TableHead>Status Akun</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead className="text-right">Aksi Kelola</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const roleName = user.role?.name || "Tamu / Belum Diatur";
                const isSuperAdmin = user.role?.name === "superadmin";
                const dateStr = new Date(user.created_at).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "short", year: "numeric" }
                );

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-semibold text-main">{user.full_name}</div>
                      <div className="text-xs text-muted">ID: {user.id.slice(0, 8)}...</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          isSuperAdmin
                            ? "brand"
                            : user.role
                            ? "default"
                            : "secondary"
                        }
                      >
                        {roleName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "success" : "warning"}>
                        {user.is_active ? "Aktif" : "Menunggu Aktivasi"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted">{dateStr}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Role Selector Form */}
                        <form
                          action={async (formData: FormData) => {
                            "use server";
                            const newRoleId = formData.get("role_id") as string;
                            await updateUserRoleAction(user.id, newRoleId);
                          }}
                          className="inline-flex items-center"
                        >
                          <select
                            name="role_id"
                            defaultValue={user.role_id || ""}
                            onChange={(e) => e.target.form?.requestSubmit()}
                            className="text-xs border border-border bg-surface text-main rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                          >
                            <option value="">-- Role: Tamu --</option>
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </form>

                        {/* Toggle Status Button */}
                        <form
                          action={async () => {
                            "use server";
                            await toggleUserStatusAction(user.id, user.is_active);
                          }}
                          className="inline"
                        >
                          <Button
                            variant={user.is_active ? "destructive" : "primary"}
                            size="sm"
                            type="submit"
                            className="text-xs h-7 px-2.5"
                          >
                            {user.is_active ? "Nonaktifkan" : "Aktifkan"}
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* 4. Pagination */}
          <Pagination
            currentPage={1}
            totalPages={1}
            totalItems={users.length}
          />
        </div>
      )}
    </div>
  );
}
