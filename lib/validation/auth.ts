import { z } from "zod";

/**
 * Single source of truth for auth input rules.
 * Used on the client (instant feedback) AND on the server (never trust the client).
 */

export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(254, "Email is too long");

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters") // bcrypt's practical limit
    .refine((pw) => /[a-z]/.test(pw), "Include at least one lowercase letter")
    .refine((pw) => /[A-Z]/.test(pw), "Include at least one uppercase letter")
    .refine((pw) => /[0-9]/.test(pw), "Include at least one number");

// The enum only validates that the requested role is a known role. It does NOT
// grant it: privileged roles (ADMIN, DIRECTEUR, RH, PM, FINANCE) must be created
// as PENDING and released by an approver on the backend — the client asking for
// one only ever produces an approval request, never instant access. The default
// is VIEWER (least privilege) so an omitted/absent role can never fall through to
// anything sensitive.
export const roleSchema = z.enum(["ADMIN", "DIRECTEUR", "CHEF_CHANTIER", "MAGASINIER", "RH", "FINANCE", "PM", "ACHAT", "VIEWER"]).default("VIEWER");

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema.optional(),
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"), // don't re-validate strength on login
});

export const changeEmailSchema = z.object({
    newEmail: emailSchema,
    currentPassword: z.string().min(1, "Current password is required"),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
});

export const deleteAccountSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;