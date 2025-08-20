"use client";

import { useState } from "react";

import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/data/users";
import { cn, getInitials } from "@/lib/utils";

export default function AccountSwitcher() {
  const user = useCurrentUser();

  const [activeUser, setActiveUser] = useState(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={"/assets/avatars/arhamkhnz.png"} alt={activeUser.name} />
          <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem
          key={user.email}
          className={cn("p-0", user.id === activeUser.id && "bg-accent/50 border-l-primary border-l-2")}
          onClick={() => setActiveUser(user)}
        >
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={ "/assets/avatars/arhamkhnz.png"} alt={user.name} />
              <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs capitalize">{user.isAdmin ? "admin" : user.role}</span>
            </div>
          </div>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
