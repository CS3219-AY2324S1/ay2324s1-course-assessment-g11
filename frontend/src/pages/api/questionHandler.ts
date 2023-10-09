import { questionApiPathAddress } from "@/firebase-client/gateway-address";
import { Difficulty } from "../../../types/QuestionTypes";

export const fetchRandomQuestion = async (
  difficulty: Difficulty,
  topics: string[] = [],
  user: any
) => {
  try {
    const url = `${questionApiPathAddress}/random-question`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ difficulty, topics }),
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchQuestions = async (user: any) => {
  try {
    const url = `${questionApiPathAddress}list`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    const data = await response.json();
    if (data && data.questions) {
      const questions = data.questions.map((question: any) => ({
        title: question.title,
        difficulty: question.difficulty,
        topics: question.topics,
      }));
      return questions;
    } else {
      throw new Error("Invalid data format from the server");
    }
  } catch (error) {
    console.error("There was an error fetching the questions", error);
    throw error;
  }
};