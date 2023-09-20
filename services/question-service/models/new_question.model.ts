// Specify the interface for a new question object
export interface NewQuestion {
    topics: string[];
    difficulty: "easy" | "medium" | "hard";
    title: string;
    content: string; // Markdown text
    testCasesInputs: string[];
    testCasesOutputs: string[];
    defaultCode: { [language: string]: string };
    solution:  { [language: string]: string };
};
