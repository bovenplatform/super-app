"use server";

import { guardAdminPage } from "@/lib/rbac";
import { createServerSupabase } from "@/lib/supabase";
import { BeritaSchema } from "@superapp/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBeritaAction(formData: FormData) {
  const user = await guardAdminPage("berita.manage");

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content") || null,
    cover_image_url: formData.get("cover_image_url") || null,
    status: (formData.get("status") as string) || "published",
    category_id: (formData.get("category_id") as string) || null,
  };

  const parsed = BeritaSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Data input tidak valid";
    redirect(`/admin/berita/create?error=${encodeURIComponent(errorMsg)}`);
  }

  const supabase = await createServerSupabase();

  const insertPayload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    content: parsed.data.content ?? null,
    cover_image_url: parsed.data.cover_image_url ?? null,
    status: parsed.data.status,
    author_id: user.id,
  };

  const { error } = await supabase.from("berita").insert(insertPayload as any);

  if (error) {
    redirect(`/admin/berita/create?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/berita");
  revalidatePath("/admin/berita");
  redirect("/admin/berita?message=created");
}

export async function deleteBeritaAction(id: string) {
  await guardAdminPage("berita.manage");
  const supabase = await createServerSupabase();

  await supabase.from("berita").delete().eq("id", id);

  revalidatePath("/berita");
  revalidatePath("/admin/berita");
}
