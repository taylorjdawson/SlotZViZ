import { AppStateContext } from "@/components/AppStateContext"
import { useContext } from "react"

const useAppState = () => {
  const context = useContext(AppStateContext)

  if (context === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider")
  }

  return context
}

export default useAppState
