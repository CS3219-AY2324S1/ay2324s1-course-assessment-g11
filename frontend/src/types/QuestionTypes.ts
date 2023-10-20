export type Difficulty = "easy" | "medium" | "hard" | "any";

export type ProgrammingLanguages = "javascript" | "python" | "java" | "c++";

export type Question = {
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
  description: string;
  solution: string;
  author: string;
  defaultCode: {
    javascript?: string;
    python?: string;
    java?: string;
    "c++"?: string;
  };
};
