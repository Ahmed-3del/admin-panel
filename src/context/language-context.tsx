"use client";
import i18n from "@/lib/i18n";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface LanguageContextType {
    lang: string;
    changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [lang, setLang] = useState<string>("en");

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("abwab-lang", lng);
        setLang(lng);
        document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lng;
    };

    useEffect(() => {
        const storedLang = localStorage.getItem("abwab-lang") || "en";
        changeLanguage(storedLang);
    }, []);

    return (
        <LanguageContext.Provider value={{ lang, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};