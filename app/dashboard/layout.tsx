import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import StaffRouteGuard from "@/components/dashboard/StaffRouteGuard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <StaffRouteGuard>
        <Sidebar />
        <main className="pl-56">{children}</main>
      </StaffRouteGuard>
    </div>
  );
}
