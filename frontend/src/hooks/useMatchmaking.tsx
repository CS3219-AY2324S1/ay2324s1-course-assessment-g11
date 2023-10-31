import { useContext } from "react";
import { MatchmakingContext } from "../providers/MatchmakingProvider";
import { getMatchByRoomid } from "@/pages/api/matchHandler";

export function useMatchmaking() {
  const context = useContext(MatchmakingContext);
  if (!context) {
    throw new Error("useMatchmaking must be used within a MatchmakingProvider");
  }
  return context;
}

export const getQuestionIdFromMatch = async (roomId: string) => {
  const match = await getMatchByRoomid(roomId);
  return match?.questionId;
};
