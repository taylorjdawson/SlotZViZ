import { Bid } from "@/lib/types";
import * as d3 from "d3";
import { CSSProperties } from "react";

interface BidsScatterPlotProps {
  data: Bid[];
}

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

const formatTime = (time: number) => {
  const date = new Date(time);
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${minutes}:${seconds}`;
};

function Chart({ data }: BidsScatterPlotProps) {
  data.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
  let bids = data.map(({ timestamp, value, builderPubKey }) => ({
    timestamp: new Date(parseInt(timestamp)),
    value: parseFloat(value),
    builderPubKey,
  }));

  let xScale = d3
    .scaleTime()
    .domain([bids[0].timestamp, bids[bids.length - 1].timestamp])
    .range([0, 100]);

  const maxBidValue = d3.max(bids.map((d) => d.value)) ?? 0;
  let yScale = d3
    .scaleLinear()
    .domain([0, maxBidValue * 1.1])
    .range([100, 0]);

  return (
    <div
      className="@container relative h-full w-full"
      style={
        {
          "--marginTop": "6px",
          "--marginRight": "8px",
          "--marginBottom": "25px",
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
          <g key={i} className="overflow-visible font-medium text-gray-500">
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
                className="text-xs tabular-nums text-gray-600"
                fill="currentColor"
              >
                {+value / 10e18}
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
                className="text-gray-700"
                key={i}
              >
                <line
                  x1={0}
                  x2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}

          {/* Scatter plot points */}
          {bids.map((d, i) => (
            <g key={i} className="">
              {/* <div className=" w-10 h-25 z-10 ">{d.builder_pubkey.substring(0, 8)}</div>  */}
              <path
                data-pubkey={d.builderPubKey.substring(0, 8)}
                key={d.builderPubKey.toString()}
                d={`M ${xScale(d.timestamp)} ${yScale(d.value)} l 0.0001 0`}
                vectorEffect="non-scaling-stroke"
                strokeWidth="8"
                strokeLinecap="round"
                fill="#ffffff"
                stroke={colorHash(d.builderPubKey)}
                className="text-white  "
              />{" "}
            </g>
          ))}
        </svg>
      </svg>
    </div>
  );
}

export default Chart;
