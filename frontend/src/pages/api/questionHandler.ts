import { questionApiPathAddress } from "@/backend-address/backend-address";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { formSchema } from "../questions/_form";
import { z } from "zod";

export const fetchRandomQuestion = async (
  difficulty: Difficulty,
  topics: string[] = []
) => {
  try {
    const url = `${questionApiPathAddress}random-question`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ difficulty, topics }),
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const rawData = (await response.json());
    if (!rawData || rawData.length === 0) {
      throw new Error("No question found");
    }
    const data = rawData[0];
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
    console.error(error);
    throw error;
  }
};

export type QuestionFilterConditions = {
  difficulty?: Difficulty;
  topics?: string[];
  author?: string;
  searchTitle?: string;
  sort?: {"title": 1 | -1} // 1 for asc, -1 for desc
}

export const fetchQuestions = async (pageNumber: number = 1, pageSize: number = 10, conditions: QuestionFilterConditions = {}) => {
  try {
    const url = `${questionApiPathAddress}list?`;

    const jsonBody: any = {
      page: pageNumber,
      limit: pageSize,
      ...conditions
    };
    if (jsonBody.difficulty === "any") {
      jsonBody.difficulty = ["easy", "medium", "hard"];
    } else if (jsonBody.difficulty) {
      jsonBody.difficulty = [jsonBody.difficulty];
    }

    const response = await fetch(url + new URLSearchParams({
      body: JSON.stringify({
        page: pageNumber,
        limit: pageSize,
        ...conditions
      })
    }), {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
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
      return {
        questions,
        hasNextPage: data.hasNextPage,
      };
    } else {
      throw new Error("Invalid data format from the server");
    }
  } catch (error) {
    console.error("There was an error fetching the questions", error);
    throw error;
  }
};

export const fetchQuestion = async (questionId: string) => {
  const url = `${questionApiPathAddress}question/${questionId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
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

export const postQuestion = async (question: z.infer<typeof formSchema>) => {
  try {
    const url = `${questionApiPathAddress}question`;

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
        "Content-Type": "application/json"
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

export const putQuestion = async (question: z.infer<typeof formSchema>, questionId: string) => {
  try {
    const url = `${questionApiPathAddress}question/${questionId}`;

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
        "Content-Type": "application/json"
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

export const deleteQuestion = async (questionId: string) => {
  try {
    const url = `${questionApiPathAddress}question/${questionId}`;

    const response = await fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
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
