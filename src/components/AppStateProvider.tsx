import React, { useState } from "react"
import { AppStateContext } from "./AppStateContext"
import { GroupBy } from "@/lib/types"

const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState = {
    observers: {},
    observeHover: false,
    groupBy: "entity" as GroupBy,
  }

  const [state, setState] = useState(initialState)

  return (
    <AppStateContext.Provider value={{ state, setState }}>
      {children}
    </AppStateContext.Provider>
  )
}

export default AppStateProvider
