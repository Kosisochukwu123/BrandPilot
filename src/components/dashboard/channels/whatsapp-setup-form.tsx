// src/components/dashboard/channels/whatsapp-setup-form.tsx
"use client";

import { useState } from "react";
import { connectWhatsappNumber } from "@/server/actions/whatsapp";
import { Button } from "@/components/ui/button";

export function WhatsappSetupForm() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        const result = await connectWhatsappNumber({ phoneNumber: phone });
        setIsSubmitting(false);
        if (result && !result.success) setError(result.error ?? "Failed to save");
      }}
      className="space-y-3"
    >
      <div>
        <label className="text-sm font-medium">Phone number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+15551234567"
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save number"}
      </Button>
    </form>
  );
}