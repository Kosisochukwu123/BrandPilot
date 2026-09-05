// src/app/global-error.tsx
// Catches any unhandled error in the App Router tree and shows a plain
// message instead of a raw stack trace — Next.js shows stack traces in
// dev automatically, but this is what production users see.
"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try again
        </button>
      </body>
    </html>
  );
}