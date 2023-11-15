import { useContext } from "react";
import { MatchmakingContext } from "../providers/MatchmakingProvider";

export function useMatchmaking() {
  const context = useContext(MatchmakingContext);
  if (!context) {
    throw new Error("useMatchmaking must be used within a MatchmakingProvider");
  }
  return context;
}
