import { GroupBy } from "@/lib/types"
import { User } from "@supabase/supabase-js"
import React from "react"

interface StateType {
  groupBy: GroupBy
  observeHover: boolean
  observers: Record<string, number>
  user?: User | null
  [key: string]: any
}

interface AppStateContextInterface {
  state: StateType
  setState: React.Dispatch<React.SetStateAction<StateType>>
}

// Create the context with default values
export const AppStateContext = React.createContext<
  AppStateContextInterface | undefined
>(undefined)
