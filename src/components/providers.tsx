"use client";
import { ReactNode } from "react";

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { LanguageProvider } from "@/context/language-context";
import LanguageWrapper from "@/lib/LanguageWrapper";

const queryClient = new QueryClient();

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
    return (
        <LanguageWrapper>
            <LanguageProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </LanguageProvider>
        </LanguageWrapper>
    );
}