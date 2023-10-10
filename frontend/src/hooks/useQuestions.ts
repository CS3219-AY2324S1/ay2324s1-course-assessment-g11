import { useContext } from "react";
import {
  fetchQuestions as fetchQuestionsApi,
  fetchRandomQuestion as fetchRandomQuestionApi,
} from "./../pages/api/questionHandler";
import { AuthContext } from "@/contexts/AuthContext";
import { Difficulty } from "../../types/QuestionTypes";

export const useQuestions = () => {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const fetchQuestions = async () => {
    if (authIsReady) {
      return fetchQuestionsApi(currentUser);
    }
  };

  const fetchRandomQuestion = async (
    difficulty: Difficulty,
    topics: string[] = []
  ) => {
    if (authIsReady) {
      return fetchRandomQuestionApi(difficulty, currentUser, topics);
    }
  };

  return { fetchQuestions, fetchRandomQuestion };
};
