import { Question } from "../../types/QuestionTypes";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";
import sanitizeHtml from "sanitize-html";
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

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

  return (
    <Card className={`m-2 ml-0 px-6 h-full ${className} overflow-y-auto overflow-x-wrap pb-4`}>
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center justify-center">
          <TypographyH2 className="w-fit">{question.title}</TypographyH2>
          <TypographySmall className="text-[#27CA40]">
            {question.difficulty}
          </TypographySmall>
        </div>
        {hasRoom ? (
          <Button variant="secondary" onClick={onSwapQuestionClick}>
            Swap Question
          </Button>
        ) : null}
      </div>
      <div className="flex gap-2">
        <TypographySmall>{question.category}</TypographySmall>
      </div>
      <div className="py-6">
        <TypographySmall>
          <div className="w-[40vw] overflow-x-auto">
            <Markdown rehypePlugins={[rehypeRaw]}>{cleanDescription}</Markdown>
          </div>
          <br />
        </TypographySmall>
      </div>
    </Card>
  );
}