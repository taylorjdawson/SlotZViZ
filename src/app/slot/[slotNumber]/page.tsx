import ScatterPlotChart from "@/components/ScatterPlotChart";
import SlotHeader from "@/components/SlotHeader";
import { getBlockBids } from "@/lib/utils";

import type { Metadata } from "next";
import { Suspense } from "react";

// export async function generateMetadata({
//   params,
// }: {
//   params: { slotNumber: string };
// }): Promise<Metadata> {
//   console.log(params);
//   const title = `❑ ${params.slotNumber} | SlotZ ViZ`;
//   return {
//     title,
//     openGraph: {
//       type: "website",
//       url: "https://example.com",
//       title,
//       description: "ViZ this slot yo",
//       siteName: "SlotZ ViZ",
//       images: [
//         {
//           url: "https://example.com/og.png",
//         },
//       ],
//     },
//   };
// }

export default async function Slot({
  params: { slotNumber },
}: {
  params: { slotNumber: string };
}) {
  const bids = slotNumber ? await getBlockBids(slotNumber) : [];
  return <ScatterPlotChart data={bids} />;
}
