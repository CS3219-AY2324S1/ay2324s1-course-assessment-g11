import { questionApiPathAddress } from "@/firebase-client/gateway-address";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { formSchema } from "../questions/_form";
import { z } from "zod";
import { User } from "firebase/auth";

export const fetchRandomQuestion = async (
  difficulty: Difficulty,
  user: any,
  topics: string[] = []
) => {
  try {
    const url = `${questionApiPathAddress}random-question`;
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
    if (data?.questions) {
      const questions: Question[] = data.questions.map((question: any) => ({
        title: question.title,
        difficulty: question.difficulty,
        topics: question.topics,
        author: question.author,
        id: question._id,
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

export const fetchQuestion = async (currentUser: User, questionId: string) => {
  const idToken = await currentUser.getIdToken(true);
  const url = `${questionApiPathAddress}question/${questionId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return <Question>{
      id: data._id,
      title: data.title,
      difficulty: data.difficulty,
      topics: data.topics,
      description: data.content,
      solution: "", // Not supported atm
      author: data.author, // Author id
      defaultCode: {
          ...data.defaultCode
      },
      testCasesInputs: data.testCasesInputs,
      testCasesOutputs: data.testCasesOutputs
    }
  } catch (error) {
    console.error("There was an error fetching the questions", error);
  }
};

export const postQuestion = async (user: any, question: z.infer<typeof formSchema>) => {
  try {
    const url = `${questionApiPathAddress}question`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        title: question.title,
        difficulty: question.difficulty,
        topics: question.topics,
        content: question.description,
        testCasesInputs: question.testCasesInputs,
        testCasesOutputs: question.testCasesOutputs,
        defaultCode: question.defaultCode
      }),
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to post question: ${await response.text()}`);
    }
  } catch (error) {
    console.error("There was an error posting the questions", error);
    throw error;
  }
};

export const putQuestion = async (user: any, question: z.infer<typeof formSchema>, questionId: string) => {
  try {
    const url = `${questionApiPathAddress}question/${questionId}`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify({
        title: question.title,
        difficulty: question.difficulty,
        topics: question.topics,
        content: question.description,
        testCasesInputs: question.testCasesInputs,
        testCasesOutputs: question.testCasesOutputs,
        defaultCode: question.defaultCode
      }),
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to put question: ${await response.text()}`);
    }
  } catch (error) {
    console.error("There was an error putting the questions", error);
    throw error;
  }
}

export const deleteQuestion = async (user: any, questionId: string) => {
  try {
    const url = `${questionApiPathAddress}question/${questionId}`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to delete question: ${await response.text()}`);
    }
  } catch (error) {
    console.error("There was an error deleting the questions", error);
    throw error;
  }
}
