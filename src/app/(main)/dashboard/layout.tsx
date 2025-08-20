import { ReactNode } from "react";

import { cookies } from "next/headers";

import ClientLayout from "@/components/client-layout";
import { getSidebarVariant, getSidebarCollapsible } from "@/lib/layout-preferences";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const sidebarVariant = await getSidebarVariant();
  const sidebarCollapsible = await getSidebarCollapsible();
  return (
    <ClientLayout
      defaultOpen={defaultOpen}
      sidebarVariant={sidebarVariant}
      sidebarCollapsible={sidebarCollapsible}
    >
      {children}
    </ClientLayout>
  );
}
