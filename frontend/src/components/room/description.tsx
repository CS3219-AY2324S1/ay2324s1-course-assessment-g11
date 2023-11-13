import { Difficulty, Question } from "@/types/QuestionTypes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";
import sanitizeHtml from "sanitize-html";
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { getDifficultyColor } from "../common/difficulty-selector";

type DescriptionProps = {
  question: Question;
  className?: string;
  onSwapQuestionClick?: () => void;
  hasRoom?: boolean;
};

export default function Description({
  question,
  className,
  onSwapQuestionClick,
  hasRoom = true,
}: DescriptionProps) {
  const cleanDescription = sanitizeHtml(question.description)

  const testCases = question?.testCasesInputs?.map((input, index) => {
    return { input: input, output: question?.testCasesOutputs && question.testCasesOutputs[index] };
  }) ?? [];

  return (
    <Card
      className={`m-2 ml-0 px-6 h-full ${className} overflow-y-auto overflow-x-wrap pb-4`}
    >
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center justify-center">
          <TypographyH2 className="w-fit">{question.title}</TypographyH2>
          <Badge variant="secondary" className="h-min">
            <TypographySmall className={getDifficultyColor(question.difficulty as Difficulty)}>
              {question.difficulty}
            </TypographySmall>
          </Badge>
        </div>
        {hasRoom ? (
          <Button variant="secondary" onClick={onSwapQuestionClick}>
            Swap Question
          </Button>
        ) : null}
      </div>
      <div className="flex gap-2">
        {question.topics.map((tag) => (
          <Badge variant="outline" key={tag}>
            <TypographySmall>{tag}</TypographySmall>
          </Badge>
        ))}
      </div>
      <div className="py-6">
        <TypographySmall>
          <div className="w-[40vw] overflow-x-auto">
            <Markdown rehypePlugins={[rehypeRaw]}>{cleanDescription}</Markdown>
          </div>
          <br />
          { testCases.length > 0 && (
          <div>
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Test Case Input</th>
                  <th className="px-4 py-2">Test Case Output</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((testCase, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{testCase.input}</td>
                    <td className="border px-4 py-2">{testCase.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)}
        </TypographySmall>
      </div>
    </Card>
  );
}
