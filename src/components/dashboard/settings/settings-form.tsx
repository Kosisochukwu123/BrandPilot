// src/components/dashboard/settings/settings-form.tsx
"use client";

import { useState } from "react";
import { updateProfile, updatePassword, setInitialPassword } from "@/server/actions/settings";
import { LoadingButton } from "@/components/ui/loading-button";
import { LogoutButton } from "./logout-button";
import { Eye, EyeOff, Check, X } from "lucide-react";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
];

function PasswordField({
  label,
  value,
  onChange,
  showChecklist,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  showChecklist?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showChecklist && value.length > 0 && (
        <ul className="mt-2 space-y-1">
          {RULES.map((rule) => {
            const passed = rule.test(value);
            return (
              <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? "text-primary" : "text-muted-foreground"}`}>
                {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SettingsForm({
  initialName,
  email,
  hasPassword,
}: {
  initialName: string;
  email: string;
  hasPassword: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const allRulesPass = RULES.every((r) => r.test(newPassword));

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">Profile</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              disabled
              value={email}
              className="mt-1 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          {profileMsg && <p className="text-sm text-primary">{profileMsg}</p>}
          <LoadingButton
            size="sm"
            isLoading={isSavingProfile}
            loadingText="Saving..."
            onClick={async () => {
              setProfileMsg(null);
              setIsSavingProfile(true);
              const result = await updateProfile({ name });
              setIsSavingProfile(false);
              setProfileMsg(result.success ? "Saved" : result.error ?? "Failed to save");
            }}
          >
            Save
          </LoadingButton>
        </div>
      </div>

      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">{hasPassword ? "Change password" : "Set a password"}</h2>
        {!hasPassword && (
          <p className="mt-1 text-sm text-muted-foreground">
            Your account currently only signs in with Google. Add a password to also log in
            with your email directly.
          </p>
        )}

        <div className="mt-4 space-y-4">
          {hasPassword && (
            <PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} />
          )}

          <PasswordField
            label={hasPassword ? "New password" : "Password"}
            value={newPassword}
            onChange={setNewPassword}
            showChecklist
          />

          {passwordErr && <p className="text-sm text-red-500">{passwordErr}</p>}
          {passwordMsg && <p className="text-sm text-primary">{passwordMsg}</p>}

          <LoadingButton
            size="sm"
            disabled={!allRulesPass}
            isLoading={isSavingPassword}
            loadingText={hasPassword ? "Updating..." : "Setting..."}
            onClick={async () => {
              setPasswordErr(null);
              setPasswordMsg(null);
              setIsSavingPassword(true);

              const result = hasPassword
                ? await updatePassword({ currentPassword, newPassword })
                : await setInitialPassword({ newPassword });

              setIsSavingPassword(false);

              if (!result.success) {
                setPasswordErr(result.error ?? "Failed to update password");
                return;
              }
              setPasswordMsg(
                hasPassword ? "Password updated" : "Password set — you can now log in with your email too"
              );
              setCurrentPassword("");
              setNewPassword("");
            }}
          >
            {hasPassword ? "Update password" : "Set password"}
          </LoadingButton>
        </div>
      </div>

      <div className="rounded-lg border border-red-200 p-6 dark:border-red-800/30">
        <h2 className="font-medium">Log out</h2>
        <p className="mt-1 text-sm text-muted-foreground">End your current session on this device.</p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}