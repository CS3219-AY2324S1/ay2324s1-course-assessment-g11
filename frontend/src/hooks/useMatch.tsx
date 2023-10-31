import { AuthContext } from "@/contexts/AuthContext";
import {
  getMatchByRoomid as getMatchByRoomidApi,
  patchMatchQuestionByRoomid as patchMatchQuestionByRoomidApi,
} from "@/pages/api/matchHandler";
import { User } from "firebase/auth";
import { useContext } from "react";

export const useMatch = () => {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const getQuestionIdFromMatch = async (roomId: string) => {
    if (authIsReady && currentUser) {
      const match = await getMatchByRoomidApi(currentUser, roomId);
      return match?.questionId;
    }
  };

  const updateQuestionIdInMatch = async (
    roomId: string,
    questionId: string
  ) => {
    if (authIsReady && currentUser) {
      await patchMatchQuestionByRoomidApi(currentUser, roomId, questionId);
    }
  };

  return { getQuestionIdFromMatch, updateQuestionIdInMatch };
};
