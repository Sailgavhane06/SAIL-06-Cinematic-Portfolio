import React, { Suspense } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Dashboard | SAIL.06 Cinematic Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col selection:bg-[#FF3028] selection:text-white">
      <AdminHeader />
      <div className="flex-1 w-full max-w-[1500px] mx-auto px-4 sm:px-8 py-8">
        <Suspense
          fallback={
            <div className="p-8 text-zinc-500 text-xs font-mono">
              Loading administration portal...
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}
