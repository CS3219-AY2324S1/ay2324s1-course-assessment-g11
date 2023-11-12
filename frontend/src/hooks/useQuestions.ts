import {
  fetchQuestions as fetchQuestionsApi,
  fetchRandomQuestion as fetchRandomQuestionApi,
  postQuestion as postNewQuestionApi,
  fetchQuestion as fetchQuestionApi,
} from "./../pages/api/questionHandler";
import { Difficulty } from "../types/QuestionTypes";

export const useQuestions = () => {
  const fetchQuestion = async (qid: string) => {
    return fetchQuestionApi(qid);
  };

  const fetchQuestions = async () => {
    return fetchQuestionsApi();
  };

  const fetchRandomQuestion = async (
    difficulty: Difficulty,
  ) => {
    return fetchRandomQuestionApi(difficulty);
  };

  const postNewQuestion = async (question: any) => {
    return postNewQuestionApi(question);
  };

  return {
    fetchQuestion,
    fetchQuestions,
    fetchRandomQuestion,
    postNewQuestion,
  };
};
