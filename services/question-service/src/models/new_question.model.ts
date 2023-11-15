// Specify the interface for a new question object
const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = typeof difficulties[number];
export function isDifficulty(difficulty: unknown): difficulty is Difficulty {
    return typeof difficulty === "string" && difficulties.includes(difficulty as Difficulty);
}
export interface NewQuestion {
    topics: string[];
    difficulty: Difficulty;
    title: string;
    content: string; // Markdown text
    testCasesInputs: string[];
    testCasesOutputs: string[];
    defaultCode: { [language: string]: string };
    solution:  { [language: string]: string };
}
