import { useContext } from "react";
import {
  fetchQuestions as fetchQuestionsApi,
  fetchRandomQuestion as fetchRandomQuestionApi,
  postQuestion as postNewQuestionApi,
  fetchQuestion as fetchQuestionApi,
} from "./../pages/api/questionHandler";
import { AuthContext } from "@/contexts/AuthContext";
import { Difficulty } from "../types/QuestionTypes";

export const useQuestions = () => {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const fetchQuestion = async (qid: string) => {
    if (authIsReady && currentUser) {
      return fetchQuestionApi(currentUser, qid);
    }
  };

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

  const postNewQuestion = async (question: any) => {
    if (authIsReady) {
      return postNewQuestionApi(currentUser, question);
    }
  };

  return {
    fetchQuestion,
    fetchQuestions,
    fetchRandomQuestion,
    postNewQuestion,
  };
};
