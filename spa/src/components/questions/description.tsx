import { Difficulty, Question } from "../../types/QuestionTypes";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";
import sanitizeHtml from "sanitize-html";
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Badge } from "../ui/badge";
import { getDifficultyColor } from "./columns";

type DescriptionProps = {
  question: Question;
  className?: string;
};

export default function Description({
  question,
  className,
}: DescriptionProps) {
  const cleanDescription = sanitizeHtml(question.description, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: { 'img': ['src'] },
    allowedSchemes: ['data', 'http', 'https']
  })

  return (
    <Card className={`m-2 ml-0 px-6 h-full ${className} overflow-y-auto overflow-x-wrap pb-4`}>
      <div className="flex flex- items-center justify-between py-2">
        <div className="flex items-center justify-center">
          <TypographyH2 className="w-fit">{question.title}</TypographyH2>
          <Badge variant="secondary" className="h-min mx-4">
            <TypographySmall className={getDifficultyColor(question.difficulty as Difficulty)}>
              {question.difficulty}
            </TypographySmall>
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <TypographySmall>This question will help you practice: <span className="text-secondary">{question.category}</span></TypographySmall>
      </div>
      <div className="my-6 p-6 bg-accent rounded">
        <TypographySmall>
          <div className="overflow-x-auto">
            <Markdown rehypePlugins={[rehypeRaw]}>{cleanDescription}</Markdown>
          </div>
          <br />
        </TypographySmall>
      </div>
    </Card>
  );
}
