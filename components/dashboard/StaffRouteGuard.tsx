"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const staffAllowed = ["/dashboard", "/dashboard/attendance", "/dashboard/my-appointments"];

export default function StaffRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.role === "staff") {
      const allowed = staffAllowed.some((p) => pathname === p || pathname.startsWith(p + "/"));
      if (!allowed) {
        router.replace("/dashboard/my-appointments");
      }
    }
  }, [status, session?.user?.role, pathname, router]);

  return <>{children}</>;
}
