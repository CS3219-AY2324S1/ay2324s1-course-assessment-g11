export type Difficulty = "easy" | "medium" | "hard" | "any";

export type ProgrammingLanguages = "javascript" | "python" | "java" | "c++";

export type Question = {
  title: string;
  difficulty: string;
  tags: string[];
  description: string;
  solution: string;
  defaultCode: {
    javascript: string;
    python: string;
    java: string;
    "c++": string;
  };
};

export type QuestionColumns = {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
};
