import { ImageResponse } from "next/server";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatEther } from "viem";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "edge";

export default function og({ params: { slot } }: { params: { slot: string } }) {
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
        {slot}
      </div>
    ),
    {
      ...size,
    }
  );
}
