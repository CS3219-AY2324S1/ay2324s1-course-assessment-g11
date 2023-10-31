import { AuthContext } from "@/contexts/AuthContext";
import { getMatchByRoomid as getMatchByRoomidApi } from "@/pages/api/matchHandler";
import { useContext } from "react";

export const useMatch = () => {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const getQuestionIdFromMatch = async (roomId: string) => {
    if (authIsReady && currentUser) {
      const match = await getMatchByRoomidApi(currentUser, roomId);
      return match?.questionId;
    }
  };

  return { getQuestionIdFromMatch };
};
