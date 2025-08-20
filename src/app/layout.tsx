import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "next-themes";

import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { ModalProvider } from "@/context/modal-context-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} min-h-screen antialiased`}>
        <Providers>
          <ModalProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </ModalProvider>
        </Providers>

      </body>
    </html>
  );
}
