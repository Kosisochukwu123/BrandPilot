import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { BrandTransitionProvider } from "@/components/providers/brand-transition-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BrandPilot AI — Marketing on autopilot",
  description:
    "Connect your website, generate on-brand content, and schedule it across Instagram, Facebook, X, and WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <AuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BrandTransitionProvider>
              {children}
            </BrandTransitionProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}