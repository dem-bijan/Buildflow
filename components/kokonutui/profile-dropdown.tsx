"use client";

import { FileText, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

function getInitials(email?: string): string {
  if (!email) return "?";
  const local = email.split("@")[0];
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  showTopbar?: boolean;
}

export default function ProfileDropdown({
  className,
  ...props
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();
  const name = "@" + user?.email?.split("@")[0];

  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      href: "#",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      label: "Terms & Policies",
      href: "#",
      icon: <FileText className="h-4 w-4" />,
      external: true,
    },
  ];
  const router = useRouter();
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await new Promise((r) => setTimeout(r, 0));
      window.location.href = "/";
    }
    catch {
      alert("Logout failed");
    }

  }

  return (
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="flex pr-0 sm:pr-5  relative">
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center  gap-4 sm:min-w-40 max-w-80 rounded-2xl border border-zinc-200/60 h-15  p-3 transition-all duration-200 bg-surface-card dark:bg-surface-card-dark hover:border-zinc-300 hover:bg-zinc-50/80 hover:shadow-sm focus:outline-none dark:border-zinc-800/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/40"
              type="button"
            >
              <div className="flex-1 text-left">
                <div className="text-sm font-serif font-bold text-zinc-900 leading-tight tracking-tight dark:text-zinc-100">
                  {name}
                </div>
                <div className="text-xs font-serif text-zinc-500 leading-tight tracking-tight dark:text-zinc-400">
                  {user?.email}
                </div>
              </div>
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-zinc-900">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                      {getInitials(user?.email)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>



          <DropdownMenuContent
            align="end"
            className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-64 origin-top-right rounded-2xl border border-zinc-200/60 bg-white/95 p-2 shadow-xl shadow-zinc-900/5 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in dark:border-zinc-800/60 dark:bg-zinc-900/95 dark:shadow-zinc-950/20"
            sideOffset={4}
          >
            <div className="space-y-1">
              {menuItems.map((item) => (
                <DropdownMenuItem asChild key={item.label}>
                  <Link
                    className="group flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60"
                    href={item.href}
                  >
                    <div className="flex flex-1 items-center gap-2">
                      {item.icon}
                      <span className="whitespace-nowrap font-medium text-sm text-zinc-900 leading-tight tracking-tight transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">
                        {item.label}
                      </span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && (
                        <span
                          className={cn(
                            "rounded-md px-2 py-1 font-medium text-xs tracking-tight",
                            item.label === "Model"
                              ? "border border-blue-500/10 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                              : "border border-purple-500/10 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                          )}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

            <DropdownMenuItem asChild>
              <button
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-red-500/10 p-3 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/20 hover:shadow-sm"
                type="button"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                <span className="font-medium text-red-500 text-sm group-hover:text-red-600">
                  Sign Out
                </span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
