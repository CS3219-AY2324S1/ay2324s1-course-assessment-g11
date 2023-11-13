export type Difficulty = "easy" | "medium" | "hard" | "any";

export type ProgrammingLanguages = "javascript" | "python" | "java" | "c++";

export type Question = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  category: string;
};
