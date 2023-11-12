import { Difficulty, Question } from "../../types/QuestionTypes";
import { formSchema } from "../_form";
import { z } from "zod";

export const fetchRandomQuestion = async (
  difficulty: Difficulty,
) => {

};

export type QuestionFilterConditions = {
  difficulty?: Difficulty;
  author?: string;
  searchTitle?: string;
  sort?: {"title": 1 | -1} // 1 for asc, -1 for desc
}

export const fetchQuestions = (pageNumber: number = 1, pageSize: number = 10, conditions: QuestionFilterConditions = {}) => {

};

export const fetchQuestion = (questionId: string): Question => {
  return {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    description: "Given two sum, find three sum.",
    author: "Charisma",
    defaultCode: {
      javascript: "function twoSum(nums, target) {\n\n}",
      python: "def twoSum(nums, target):\n\n",
    },
  }
};

export const postQuestion = (question: z.infer<typeof formSchema>) => {

};

export const putQuestion = (question: z.infer<typeof formSchema>, questionId: string) => {

}

export const deleteQuestion = (questionId: string) => {

}
