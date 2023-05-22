import SearchBox from "@/components/SearchBox";

export default function DashboardLayout({
  children,
  params: { slotNumber },
}: {
  children: React.ReactNode;
  params: { slotNumber: string };
}) {
  return (
    <main className="flex flex-col h-screen items-center p-16 xl:p-20">
      {children}
      <SearchBox />
    </main>
  );
}
