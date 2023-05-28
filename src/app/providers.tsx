"use client"

import { Web3OnboardProvider } from "@web3-onboard/react"
import { web3Onboard } from "@/lib/onboard"
import { ReactNode } from "react"
import AppStateProvider from "@/components/AppStateProvider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        {children}
      </Web3OnboardProvider>
    </AppStateProvider>
  )
}
