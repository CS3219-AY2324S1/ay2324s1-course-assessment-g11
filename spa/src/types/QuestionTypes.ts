export type Difficulty = "easy" | "medium" | "hard" | "any";

export type Question = {
  id?: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  category: string;
};
