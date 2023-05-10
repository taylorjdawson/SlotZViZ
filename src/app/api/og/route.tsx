import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatEther } from "viem";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

import { getBlockBids } from "@/lib/utils";

export const runtime = "edge";

interface Bid {
  builder_pubkey: string;
  timestamp_ms: string;
  value: string;
}

interface BidsScatterPlotProps {
  data: Bid[];
}

const colorHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const BidsScatterPlot = ({ data }: BidsScatterPlotProps) => {
  // Group bids by builder
  const bidsByBuilder = data.reduce<{
    [key: string]: { builder_pubkey: string; bids: Bid[]; color: string };
  }>((acc, bid) => {
    if (!acc[bid.builder_pubkey]) {
      acc[bid.builder_pubkey] = {
        builder_pubkey: bid.builder_pubkey,
        bids: [],
        color: colorHash(bid.builder_pubkey),
      };
    }
    acc[bid.builder_pubkey].bids.push({
      ...bid,
      value: formatEther(BigInt(bid.value)),
    });
    return acc;
  }, {});

  return (
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="timestamp_ms"
        domain={["dataMin", "dataMax"]}
        name="Time"
        type="number"
      />
      <YAxis
        padding={{ top: 20, bottom: 20 }}
        scale="linear"
        dataKey="value"
        domain={["dataMin", "dataMax"]}
        name="Value"
        type="number"
      />
      {Object.values(bidsByBuilder).map((builderBids) => {
        return (
          <Scatter
            isAnimationActive={false}
            data={builderBids.bids}
            fill={builderBids.color}
            key={builderBids.builder_pubkey}
            name={`${builderBids.builder_pubkey.substring(0, 8)}`}
          />
        );
      })}
    </ScatterChart>
  );
};

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
        <BidsScatterPlot data={bids} />
      </main>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
