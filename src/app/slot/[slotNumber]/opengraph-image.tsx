import { ImageResponse } from "next/server";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatEther } from "viem";

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

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "edge";

export default function og() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        About Acme
      </div>
    ),
    {
      ...size,
    }
  );
}
