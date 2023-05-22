import "./globals.css";
import Image from "next/image";
import {
  Orbitron,
  Major_Mono_Display,
  VT323,
  Bebas_Neue,
  Fira_Code,
  Fira_Mono,
} from "next/font/google";
import bgImage from "../assets/slotz-viz-art-0.png";

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-major-mono",
});

const majorMono = Fira_Code({
  weight: ["400", "300", "500", "700", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-major-mono",
});

export const metadata = {
  title: "SlotZ ViZ",
  description: "See a slot don't be a slot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${majorMono.className} relative`}>
      <body className=" bg-bold-dark bg-gradient-to-tr from-[#d7269320] via-transparent to-[#0AFE9720]">
        {children}
      </body>
    </html>
  );
}
