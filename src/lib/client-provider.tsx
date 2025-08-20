"use client";

import { LanguageProvider } from "@/context/language-context";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            {children}
        </LanguageProvider>
    );
}