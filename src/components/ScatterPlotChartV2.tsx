"use client";

import { Bid } from "@/lib/types";
import * as d3 from "d3";
import { CSSProperties, useState } from "react";
import { formatEther } from "viem";
import { motion, AnimatePresence } from "framer-motion";
import { colorHash } from "@/lib/utils";
import { BUILDER_PUBKEY_IDS } from "@/lib/constants";

interface BidsScatterPlotProps {
  data: Bid[];
  selectedBuilders: Set<string>;
}

const formatTime = (time: number, millis = false) => {
  const date = new Date(time);
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${minutes}:${seconds}${millis ? `:${milliseconds}` : ""}`;
};

function Chart({ data, selectedBuilders }: BidsScatterPlotProps) {
  console.log(data);
  data?.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
  let bids = data?.map(({ timestamp, value, ...bidData }) => ({
    timestamp: new Date(parseInt(timestamp)),
    value: parseFloat(value),
    ...bidData,
  }));

  let xScale = d3
    .scaleTime()
    .domain([bids[0]?.timestamp, bids[bids.length - 1]?.timestamp])
    .range([0, 100]);

  const maxBidValue = d3.max(bids.map((d) => d.value)) ?? 0;
  let yScale = d3
    .scaleLinear()
    .domain([0, maxBidValue * 1.1])
    .range([100, 0]);

  const [infoBox, setInfoBox] = useState<{
    pubKey: string;
    value: string;
    time: string;
    label: string;
  } | null>();

  return (
    <div
      className="@container relative h-full w-full m-5"
      style={
        {
          "--marginTop": "6px",
          "--marginRight": "8px",
          "--marginBottom": "16px",
          "--marginLeft": "25px",
        } as CSSProperties
      }
    >
      {/* X axis */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {xScale.ticks(6).map((value, i) => (
          <g key={i} className="overflow-visible font-medium text-slate-300">
            <text
              x={`${xScale(+value)}%`}
              y="100%"
              textAnchor={
                i === 0 ? "start" : i === bids.length - 1 ? "end" : "middle"
              }
              fill="currentColor"
              className="@sm:inline hidden text-sm"
            >
              {formatTime(+value)}
            </text>
            <text
              x={`${xScale(+value)}%`}
              y="100%"
              textAnchor={
                i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
              }
              fill="currentColor"
              className="@sm:hidden text-xs"
            >
              {formatTime(+value)}
            </text>
          </g>
        ))}
      </svg>

      {/* Y axis */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        <g className="translate-x-4">
          {yScale
            .ticks(10)
            .map(yScale.tickFormat(10, "d"))
            .map((value, i) => (
              <text
                key={i}
                y={`${yScale(+value)}%`}
                alignmentBaseline="middle"
                textAnchor="end"
                className="text-xs tabular-nums text-slate-300"
                fill="currentColor"
              >
                {formatEther(BigInt(value))}
              </text>
            ))}
        </g>
      </svg>

      {/* Chart area */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {yScale
            .ticks(10)
            .map(yScale.tickFormat(10, "d"))
            .map((active, i) => (
              <g
                transform={`translate(0,${yScale(+active)})`}
                className=" text-white/40"
                key={i}
              >
                <line
                  x1={0}
                  x2={100}
                  stroke="currentColor"
                  strokeWidth={0.2}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}

          {/* Scatter plot points */}
          {bids.map(({ builderPubKey, timestamp, value }, i) => (
            <g key={i}>
              <path
                data-pubkey={builderPubKey.substring(0, 8)}
                key={timestamp.toString()}
                d={`M ${xScale(timestamp)} ${yScale(value)} l 0.0001 0`}
                vectorEffect="non-scaling-stroke"
                strokeWidth="8"
                strokeLinecap="round"
                fill="#ffffff"
                stroke={
                  selectedBuilders?.size > 0
                    ? selectedBuilders.has(builderPubKey)
                      ? colorHash(builderPubKey)
                      : `${colorHash(builderPubKey)}10`
                    : colorHash(builderPubKey)
                }
                className="text-white hover:stroke-[14px] cursor-pointer transition-all duration-200 ease-in-out shadow-2xl"
                onMouseEnter={() => {
                  setInfoBox({
                    label:
                      BUILDER_PUBKEY_IDS[builderPubKey] ??
                      builderPubKey.substring(0, 8),
                    pubKey: builderPubKey,
                    time: formatTime(+timestamp, true),
                    value: formatEther(BigInt(value)),
                  });
                }}
                onMouseLeave={() => {
                  setInfoBox(null);
                }}
              />
            </g>
          ))}
        </svg>
      </svg>

      <AnimatePresence>
        {infoBox && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{
              duration: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="absolute indicator text-sm p-4 flex flex-col top-[10%] left-[5%] w-max h-max backdrop-blur-xl bg-transparent bg-gradient-to-tr from-[#d7269310] to-[#0AFE9710] rounded-sm"
          >
            <span
              style={{
                backgroundColor: colorHash(infoBox.pubKey),
                boxShadow: `${colorHash(infoBox.pubKey)}60 2px 3px 22px 2px`,
              }}
              className={`indicator-item indicator-start badge badge-xs transition-all duration-300`}
            ></span>
            <span>{infoBox.label}</span>
            <div className="font-semibold text-lg">
              {Number.parseFloat(infoBox.value).toFixed(6)}
              <span className=" text-xs text-gray-400">Ξ</span>
            </div>
            <span className=" text-sm text-gray-400">{infoBox.time}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chart;
