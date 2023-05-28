"use client"
import { Dna } from "react-loader-spinner"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Dna
        visible={true}
        height="120"
        width="120"
        ariaLabel="dna-loading"
        wrapperStyle={{ margin: "auto", marginTop: "224px" }}
      />
    </div>
  )
}
