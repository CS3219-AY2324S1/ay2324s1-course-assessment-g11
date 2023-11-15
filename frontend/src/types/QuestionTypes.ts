export type Difficulty = "easy" | "medium" | "hard" | "any";

export type ProgrammingLanguages = "javascript" | "python" | "java" | "c++";

export type Question = {
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
  description: string;
  solution?: {
    javascript?: string;
    python?: string;
    java?: string;
    "c++"?: string;
  };
  author: string;
  defaultCode: {
    selectedLanguage(selectedLanguage: any): unknown;
    javascript?: string;
    python?: string;
    java?: string;
    "c++"?: string;
  };
  testCasesInputs?: string[];
  testCasesOutputs?: string[];
};
