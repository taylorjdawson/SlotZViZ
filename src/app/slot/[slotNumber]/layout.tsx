"use client";

import SearchBox from "@/components/SearchBox";
import SlotHeader from "@/components/SlotHeader";

export default function DashboardLayout({
  children,
  params: { slotNumber },
}: {
  children: React.ReactNode;
  params: { slotNumber: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <SlotHeader slot={parseInt(slotNumber)} />
      {children}
      <SearchBox />
    </main>
  );
}
