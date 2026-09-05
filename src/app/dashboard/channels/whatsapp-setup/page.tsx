// src/app/dashboard/channels/whatsapp-setup/page.tsx
// WhatsApp has no per-user OAuth (see Phase 5a) — this page collects the
// opted-in phone number to broadcast to, stored as a Channel row with
// type WHATSAPP, so it renders consistently in the Channels grid.
import { WhatsappSetupForm } from "@/components/dashboard/channels/whatsapp-setup-form";

export default function WhatsappSetupPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold">WhatsApp Broadcast Setup</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        WhatsApp doesn't support connecting an account like Instagram or X.
        Instead, add a number that has opted in to receive your broadcasts —
        messages send as pre-approved templates only.
      </p>

      <div className="mt-6">
        <WhatsappSetupForm />
      </div>
    </div>
  );
}