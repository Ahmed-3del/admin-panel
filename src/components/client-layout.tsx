'use client';

import { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AccountSwitcher from "@/modules/main/_components/sidebar/account-switcher";
import { AppSidebar } from "@/modules/main/_components/sidebar/app-sidebar";
import LayoutControls from "@/modules/main/_components/sidebar/layout-controls";
import ThemeSwitcher from "@/modules/main/_components/sidebar/theme-switcher";
import LanguageSwitcher from "@/lib/LanguageSwitcher";

export default function ClientLayout({
    children,
    defaultOpen,
    sidebarVariant,
    sidebarCollapsible,
}: {
    children: ReactNode;
    defaultOpen: boolean;
    sidebarVariant: "sidebar" | "floating" | "inset" | undefined;
    sidebarCollapsible: "offcanvas" | "icon" | "none" | undefined;
}) {

    return (
        <SidebarProvider  defaultOpen={defaultOpen}>
            <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
            <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex w-full items-center justify-between px-4 lg:px-6">
                        <div className="flex items-center gap-1 lg:gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                            <h1 className="text-base font-medium">ABWAB DIGITAL</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <LayoutControls
                                variant={sidebarVariant ?? "sidebar"}
                                collapsible={
                                    sidebarCollapsible === "offcanvas" || sidebarCollapsible === "icon"
                                        ? sidebarCollapsible
                                        : "offcanvas"
                                }
                            />
                            <LanguageSwitcher variant="minimal" />
                            <ThemeSwitcher />
                            <AccountSwitcher />
                        </div>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
