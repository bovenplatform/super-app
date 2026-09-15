import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const UpdatePasswordSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
