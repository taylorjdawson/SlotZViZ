"use client";

import React, { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { timeFormat } from "d3-time-format";
import { formatEther } from "viem";
import { BUILDER_PUBKEY_IDS } from "@/lib/constants";

interface Bid {
  builder_pubkey: string;
  timestamp_ms: string;
  value: string;
}

interface BidsScatterPlotProps {
  data: Bid[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {}

const formatTime = (time: string) => {
  console.log({ time });
  const date = new Date(time);
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${seconds}s${milliseconds}ms`;
};

const customTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    console.log({ data });
    return (
      <div className="custom-tooltip">
        <p className="label">Time: {formatTime(data.timestamp_ms)}</p>
        <p className="desc">Bid: {data.value} ETH</p>
        <p className="desc">Builder: {data.builder_pubkey}</p>
      </div>
    );
  }

  return null;
};

const CustomLegend: React.FC<{
  payload: { value: string; color: string }[];
  onClick: (builder_pubkey: string) => void;
}> = ({ payload, onClick }) => {
  return (
    <ul className="custom-legend">
      {payload.map((entry) => (
        <li
          key={entry.value}
          onClick={() => onClick(entry.value)}
          style={{ color: entry.color }}
        >
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const colorHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const BidsScatterPlot: React.FC<BidsScatterPlotProps> = ({ data }) => {
  // Group bids by builder
  const bidsByBuilder =
    data?.length > 0
      ? data.reduce<{
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
        }, {})
      : {};

  const [activeBuilder, setActiveBuilder] = useState<string | null>(null);
  const handleLegendClick = (entry: any) => {
    const builder_pubkey = entry.dataKey;
    setActiveBuilder(builder_pubkey);
  };

  return (
    <ResponsiveContainer width="100%" height={800}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp_ms"
          domain={["dataMin", "dataMax"]}
          name="Time"
          tickFormatter={(tick) => {
            const date = new Date(tick);
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");
            const milliseconds = date
              .getMilliseconds()
              .toString()
              .padStart(3, "0");
            return `${seconds}s${milliseconds}ms`;
          }}
          type="number"
        />
        <YAxis
          padding={{ top: 20, bottom: 20 }}
          scale="linear"
          dataKey="value"
          domain={["dataMin", "dataMax"]}
          name="Value"
          tickFormatter={(tick) => `${parseFloat(tick).toFixed(2)} ETH`}
          type="number"
        />
        <Tooltip content={customTooltip} />
        <Legend
          iconSize={8}
          onClick={handleLegendClick}
          wrapperStyle={{
            cursor: "pointer",
          }}
        />
        {Object.values(bidsByBuilder).map((builderBids) => {
          return (
            <Scatter
              data={builderBids.bids}
              fill={`${builderBids.color}${
                builderBids.builder_pubkey === activeBuilder ? "FF" : "FF"
              }`}
              key={builderBids.builder_pubkey}
              name={`${
                BUILDER_PUBKEY_IDS[builderBids.builder_pubkey] ??
                builderBids.builder_pubkey.substring(0, 8)
              }`}
            />
          );
        })}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default BidsScatterPlot;
