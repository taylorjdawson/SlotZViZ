import SearchBox from "@/components/SearchBox"
import { ConnectButton } from "@/components"

export default function DashboardLayout({
  children,
  params: { slotNumber },
}: {
  children: React.ReactNode
  params: { slotNumber: string }
}) {
  return (
    <main className="flex flex-col h-screen overflow-hidden items-center sm:p-4 md:p-8 lg:p-16 xl:p-20">
      <div className="w-full h-full mb-8">
        <ConnectButton />
        {children}
        <SearchBox />
      </div>
      <div className="font-bold text-xs -mb-8 opacity-60">
        |⟐|{"  "}The Council of Slot Observers |⟐|
      </div>
    </main>
  )
}
