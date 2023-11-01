import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import {
  getAttemptsOfUser,
  createAttemptOfUser,
} from "./../pages/api/historyHandler";

type AttemptData = {
  uid: string;
  question_id: string;
  answer: string;
  solved: boolean; // just set everything as false for now (no need to check)
};

export const useHistory = () => {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const fetchAttempts = async (uid: string) => {
    if (authIsReady) {
      return getAttemptsOfUser(currentUser, uid);
    }
  };

  const postAttempt = async (data: AttemptData) => {
    if (authIsReady) {
      return createAttemptOfUser(currentUser, data);
    }
  };

  return { fetchAttempts, postAttempt };
};
