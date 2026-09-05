// src/components/ui/loading-button.tsx
// Drop-in replacement for Button whenever an onClick does async work —
// shows a spinner and disables itself automatically while pending, so
// every action button in the app behaves consistently without each
// component reimplementing its own isLoading state and icon swap.
"use client";

import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}