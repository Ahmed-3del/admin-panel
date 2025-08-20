import {
  Home,
  ReceiptText,
  Users,
  type LucideIcon,
  NotebookPenIcon,
  GlobeLock,
  Server,
  Star,
  Newspaper,
  Contact,
  MailCheck,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "main",
    items: [
      {
        title: "home",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "projects",
        url: "/dashboard/projects",
        icon: NotebookPenIcon,
        comingSoon: false,
      },
      {
        title: "clients",
        url: "/dashboard/clients",
        icon: Users,
        comingSoon: false,
      },
      {
        title: "services",
        url: "/dashboard/services",
        icon: Server,
        comingSoon: false,
      },
      {
        title: "about",
        url: "/dashboard/about",
        icon: ReceiptText,
        comingSoon: false,
      },
      {
        title: "terms",
        url: "/dashboard/terms",
        icon: ReceiptText,
        comingSoon: false,
      },
      {
        title: "privacy",
        url: "/dashboard/privacy",
        icon: GlobeLock,
        comingSoon: false,
      },
      {
        title: "testimonials",
        url: "/dashboard/testimonials",
        icon: Star,
        comingSoon: false,
      },
      {
        title: "blogs",
        url: "/dashboard/blogs",
        icon: Newspaper,
        comingSoon: false,
      },
      {
        title: "contacts",
        url: "/dashboard/contacts",
        icon: Contact,
        comingSoon: false,
      },
      {
        title: "subscriptions",
        url: "/dashboard/subscription",
        icon: MailCheck,
        comingSoon: false,
      },
    ],
  },
];
