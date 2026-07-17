"use client";

import { useAuth } from "@/lib/authContext";
import { isAllowed, type Role } from "@/lib/auth/permissions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireRole({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const role = user?.role as Role | undefined;

    useEffect(() => {
        if (!loading && !isAllowed(pathname, role)) {
            router.replace("/dashboard?forbidden=1");
        }
    }, [loading, role, pathname, router]);

    if (loading) return null;
    if (!isAllowed(pathname, role)) return null;

    return <>{children}</>;
}