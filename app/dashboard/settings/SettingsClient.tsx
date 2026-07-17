"use client";

import { useState } from "react";
import { Section, Card } from "@/components/Functions";
import { useAuth } from "@/lib/authContext";
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "@/lib/validation/auth";

const inputClass =
  "w-full rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark px-3 py-2 text-sm";
const labelClass = "text-sm space-y-1 block";
const fieldLabelClass = "text-content-muted dark:text-content-muted-dark";

function FormMessage({ error, success }: { error: string | null; success: string | null }) {
  if (error) return <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  if (success) return <p className="text-sm text-green-600 dark:text-green-400">{success}</p>;
  return null;
}

function ChangeEmailForm() {
  const { user, refetch } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const parsed = changeEmailSchema.safeParse({ newEmail, currentPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Entrée invalide.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/me/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Impossible de mettre à jour l'email.");
        return;
      }

      setSuccess("Email mis à jour.");
      setCurrentPassword("");
      setNewEmail("");
      await refetch();
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-4 sm:p-5">
      <p className="text-xs font-semibold text-content-secondary dark:text-content-secondary-dark mb-4 uppercase tracking-wide">
        Changer l&apos;email
      </p>
      <p className="text-sm text-content-muted dark:text-content-muted-dark mb-4">
        Email actuel : <span className="font-medium">{user?.email}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <label className={labelClass}>
          <span className={fieldLabelClass}>Nouvel email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          <span className={fieldLabelClass}>Mot de passe actuel</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <FormMessage error={error} success={success} />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Mise à jour…" : "Mettre à jour l'email"}
        </button>
      </form>
    </Card>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Entrée invalide.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Impossible de mettre à jour le mot de passe.");
        return;
      }

      setSuccess("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-4 sm:p-5">
      <p className="text-xs font-semibold text-content-secondary dark:text-content-secondary-dark mb-4 uppercase tracking-wide">
        Changer le mot de passe
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <label className={labelClass}>
          <span className={fieldLabelClass}>Mot de passe actuel</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          <span className={fieldLabelClass}>Nouveau mot de passe</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          <span className={fieldLabelClass}>Confirmer le nouveau mot de passe</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <FormMessage error={error} success={success} />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </Card>
  );
}

function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = deleteAccountSchema.safeParse({ currentPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Entrée invalide.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Impossible de supprimer le compte.");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-4 sm:p-5 border-red-300 dark:border-red-900/60">
      <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">
        Zone de danger
      </p>
      <p className="text-sm text-content-muted dark:text-content-muted-dark mb-4">
        La suppression de votre compte est définitive et irréversible. Toutes vos sessions seront fermées.
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10"
        >
          Supprimer mon compte
        </button>
      ) : (
        <form onSubmit={handleDelete} className="space-y-4 max-w-md">
          <label className={labelClass}>
            <span className={fieldLabelClass}>Confirmez avec votre mot de passe</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <FormMessage error={error} success={null} />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-red-700"
            >
              {submitting ? "Suppression…" : "Confirmer la suppression"}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setCurrentPassword("");
                setError(null);
              }}
              className="text-sm text-content-muted dark:text-content-muted-dark"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

export default function SettingsClient() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <h1 className="text-xl font-bold text-content-primary dark:text-content-primary-dark mb-6">
        Paramètres du compte
      </h1>

      <Section title="Identité">
        <ChangeEmailForm />
      </Section>

      <Section title="Sécurité">
        <ChangePasswordForm />
      </Section>

      <Section title="Zone de danger">
        <DeleteAccountSection />
      </Section>
    </div>
  );
}
