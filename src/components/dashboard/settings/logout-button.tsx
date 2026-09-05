// src/components/dashboard/settings/logout-button.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <Button
      variant="outline"
      disabled={isLoggingOut}
      onClick={() => {
        setIsLoggingOut(true);
        signOut({ callbackUrl: "/login" });
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? "Logging out..." : "Log out"}
    </Button>
  );
}