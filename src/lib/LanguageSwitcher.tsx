"use client"
import { Globe, Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "./utils"
import { useLanguage } from "@/context/language-context"

export interface Language {
  code: string
  name: string
  nativeName: string
  flag?: string
}

export const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "En",
    flag: "🇺🇸",
  },
  {
    code: "ar",
    name: "العربية",
    nativeName: "ع",
    flag: "🇸🇦",
  },
]

export default function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "minimal" }) {
  const { lang, changeLanguage } = useLanguage()
  const currentLanguage = languages.find((l) => l.code === lang) || languages[0]

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng)
  }

  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="icon" className="text-white " aria-label="Change language">
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover/95 space-y-1.5 backdrop-blur-sm border-none">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className={cn("flex items-center gap-2  cursor-pointer", lang === language.code && "bg-primary/10")}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span>{language.flag}</span>
              <span className={lang === language.code ? "font-medium" : ""}>{language.name}</span>
              {lang === language.code && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-2 text-white  px-2 h-8">
          <Globe className="h-4 w-4" />
          <span className="font-medium">{currentLanguage.nativeName}</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-bg backdrop-blur-sm border-none w-[140px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn("flex items-center gap-2 cursor-pointer", lang === language.code && "bg-primary/10")}
            onClick={() => handleLanguageChange(language.code)}
          >
            <span>{language.flag}</span>
            <span className={lang === language.code ? "font-medium" : ""}>{language.name}</span>
            {lang === language.code && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

