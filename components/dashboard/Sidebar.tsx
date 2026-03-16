"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Calendar,
  Users,
  UserCog,
  BarChart3,
  Scissors,
  Settings,
  LayoutDashboard,
  BookOpen,
  LogOut,
  Clock,
  UserCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";

const adminNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/booking", label: "Online Booking", icon: BookOpen },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/staff", label: "Staff", icon: UserCog },
  { href: "/dashboard/services", label: "Services", icon: Scissors },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const staffNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/attendance", label: "Check In / Out", icon: Clock },
  { href: "/dashboard/my-appointments", label: "My Appointments", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isStaff = role === "staff";
  const nav = isStaff ? staffNav : adminNav;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-56 flex-col border-r border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
      <div className="flex h-14 items-center border-b border-[var(--border)] px-4">
        <Link href={isStaff ? "/dashboard" : "/dashboard"} className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <Scissors className="h-6 w-6 text-[var(--accent)]" />
          Wellins
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-3">
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--muted)]">
          <UserCircle className="h-4 w-4" />
          {session?.user?.email}
          {isStaff && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">Staff</span>}
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-amber-400"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
