// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">SeiSwift</h2>
        <nav className="flex flex-col gap-2">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="ghost">History</Button>
          <Button variant="ghost">Settings</Button>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
