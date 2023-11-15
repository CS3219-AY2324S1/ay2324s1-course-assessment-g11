import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import {
  getLeaderboard,
} from "@/pages/api/leaderboardHandler";

export const useLeaderboard = () => {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const fetchLeaderboard = async () => {
    if (authIsReady) {
      return getLeaderboard(currentUser);
    }
  }
  
  return { fetchLeaderboard };
};
