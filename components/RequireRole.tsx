"use client";

import { useAuth } from "@/lib/authContext";
import { isAllowed } from "@/lib/auth/permissions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireRole({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    console.log("RequireRole check:", { loading, role: user?.role, pathname, allowed: isAllowed(pathname, user?.role as any) });


    useEffect(() => {
        if (!loading && !isAllowed(pathname, user?.role as any)) {
            router.replace("/dashboard?forbidden=1");
        }
    }, [loading, user, pathname, router]);

    if (loading) return null;
    if (!isAllowed(pathname, user?.role as any)) return null;

    return <>{children}</>;
}