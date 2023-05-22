"use client";

import React, { useEffect, useState } from "react";
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
import { Props } from "recharts/types/component/DefaultLegendContent";

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
  const date = new Date(parseInt(time));
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${minutes}:${seconds}:${milliseconds}`;
};

const customTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="custom-tooltip">
        <p className="label">Time: {formatTime(data.timestamp_ms)}</p>
        <p className="desc">Bid: {data.value} ETH</p>
        <p className="desc">Builder: {data.builder_pubkey.substring(0, 8)}</p>
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

const renderLegend = (props: Props) => {
  console.log(props.payload);
  return (
    <div className="flex flex-wrap">
      {props?.payload?.map((entry, index) => (
        <div style={{ color: entry.color }} key={`item-${index}`}>
          {entry.value}
        </div>
      ))}
    </div>
  );
};

const colorHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    // Shift the color range to produce lighter colors
    const value = ((hash >> (i * 8)) & 0xff) + 127;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

type BuilderBids = Record<
  string,
  {
    color: string;
    builder_pubkey: string;
    bids: Bid[];
  }
>;
const BidsScatterPlot: React.FC<BidsScatterPlotProps> = ({ data }) => {
  const [bids, setBids] = useState<BuilderBids>({});
  const [activeBuilders, setActiveBuilders] = useState<Set<string>>(new Set());
  const [hoverBuilder, setHoverBuilder] = useState<Set<string>>(new Set());

  // Group bids by builder
  useEffect(() => {
    const bidsByBuilder: BuilderBids =
      data?.length > 0
        ? data.reduce<{
            [key: string]: {
              builder_pubkey: string;
              bids: Bid[];
              color: string;
            };
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

    setBids(bidsByBuilder);
  }, [setBids, data]);

  const handleLegendClick = (entry: any) => {
    const builder_pubkey = entry.dataKey;
    if (activeBuilders.has(builder_pubkey)) {
      activeBuilders.delete(builder_pubkey);
      setActiveBuilders(new Set(activeBuilders));
    } else {
      activeBuilders.add(builder_pubkey);
      setActiveBuilders(new Set(activeBuilders));
    }
  };

  const handleLegendHover = (entry: any) => {
    const builder_pubkey = entry.dataKey;
    if (hoverBuilder.has(builder_pubkey)) {
      hoverBuilder.delete(builder_pubkey);
      setHoverBuilder(new Set(activeBuilders));
    } else {
      hoverBuilder.add(builder_pubkey);
      setHoverBuilder(new Set(activeBuilders));
    }
    console.log(hoverBuilder.keys());
  };
  return (
    <ResponsiveContainer width="100%" height={800}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        {/* <defs>
          <linearGradient id="fadeGrid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#fff", stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: "#ccc", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#fff", stopOpacity: 0 }} />
          </linearGradient>
        </defs> */}
        <defs>
          <linearGradient id="fadeGrid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#129a74" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="red" />
            <stop offset="50%" stop-color="blue" />
            <stop offset="100%" stop-color="red" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="1 1 1" stroke="#ffffff44" />
        <XAxis
          strokeDasharray="1 1 1"
          stroke="#ffffff44"
          tickLine={false}
          dataKey="timestamp_ms"
          domain={["dataMin", "dataMax"]}
          name="Time"
          tickFormatter={formatTime}
          type="number"
        />
        <YAxis
          strokeDasharray="1 1 1"
          tickLine={false}
          strokeOpacity={0.2}
          // stroke="#ffffff44"
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
        {Object.values(bids).map((builderBids) => {
          return (
            <Scatter
              opacity={
                activeBuilders.size > 0
                  ? activeBuilders.has(builderBids.builder_pubkey)
                    ? 1
                    : 0.2
                  : 1
              }
              dataKey={builderBids.builder_pubkey}
              data={builderBids.bids}
              fill={`${builderBids.color}${
                activeBuilders.size > 0
                  ? activeBuilders.has(builderBids.builder_pubkey)
                    ? "FF"
                    : "4F"
                  : "FF"
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
