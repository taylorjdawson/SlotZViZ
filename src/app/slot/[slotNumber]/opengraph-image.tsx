import ScatterPlotChartServer from "@/components/ScatterPlotChartServer"
import { getBlockBids } from "@/lib/utils"
import { ImageResponse } from "next/server"

export const runtime = "edge"
export const contentType = "image/png"

export default async function OG({
  params: { slotNumber },
}: {
  params: { slotNumber: string }
}) {
  const bids = await getBlockBids(slotNumber)
  return new ImageResponse(
    (
      // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <div tw="bg-gray-50 relative flex text-9xl">
          <div className="text-3xl">{slotNumber}</div>
          <ScatterPlotChartServer data={bids} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

// import { ImageResponse } from "next/server";

// export const alt = "Slot";
// export const size = {
//   width: 1200,
//   height: 630,
// };
// export const contentType = "image/png";
// export const runtime = "edge";

// export default function og() {

//   const font = fetch(
//     new URL("../../assets/TYPEWR__.ttf", import.meta.url)
//   ).then((res) => res.arrayBuffer());

//   return new ImageResponse(
//     (
//       <div
//         style={{
//           fontSize: 128,
//           background: "black",
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         SlotZ ViZ
//       </div>
//     ),
//     {
//       ...size,
//     }
//   );
// }
