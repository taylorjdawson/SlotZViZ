import ScatterPlotChart from "@/components/ScatterPlotChart";
import { getBlockBids } from "@/lib/utils";
import { ImageResponse } from "@vercel/og";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slotNumber: string };
}): Promise<Metadata> {
  console.log(params);
  const title = `❑ ${params.slotNumber} | SlotZ ViZ`;
  return {
    title,
    openGraph: {
      type: "website",
      url: "https://example.com",
      title,
      description: "ViZ this slot yo",
      siteName: "SlotZ ViZ",
      images: [
        {
          url: "https://example.com/og.png",
        },
      ],
    },
  };
}

export default async function Slot({
  params: { slotNumber },
}: {
  params: { slotNumber: string };
}) {
  const bids = await getBlockBids(slotNumber);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex">
        <h1>Slot: {slotNumber}</h1>
      </div>
      <ScatterPlotChart data={bids} />
    </main>
  );
}
