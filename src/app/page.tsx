import ScatterPlotChart from "@/components/ScatterPlotChart";
import Image from "next/image";
import { data } from "./data";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ScatterPlotChart data={data} />
    </main>
  );
}
