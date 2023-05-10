
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

import { getBlockBids } from "@/lib/utils";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slot = searchParams.get("slot");

  if (!slot) {
    return new ImageResponse(<>Visit with &quot;?slot=6214255&quot;</>, {
      width: 1200,
      height: 630,
    });
  }
  const bids = await getBlockBids(slot);

  return new ImageResponse(
    (
      <main className="flex p-24">
        <h1>Slot: {slot}</h1>
      </main>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
