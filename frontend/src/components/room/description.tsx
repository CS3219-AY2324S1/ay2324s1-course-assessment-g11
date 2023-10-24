import { Question } from "../../types/QuestionTypes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";

// todo change this

type DescriptionProps = {
  question: Question;
  className?: string;
};

export default function Description({
  question,
  className,
}: DescriptionProps) {
  return (
    <Card className={`m-2 ml-0 px-6 h-full ${className} overflow-y-auto overflow-x-wrap pb-4`}>
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center justify-center">
          <TypographyH2 className="w-fit">{question.title}</TypographyH2>
          <Badge variant="secondary" className="h-min">
            <TypographySmall className="text-[#27CA40]">
              {question.difficulty}
            </TypographySmall>
          </Badge>
        </div>
        <Button variant="secondary">Swap Question</Button>
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
          <div dangerouslySetInnerHTML={{ __html: question.description }} className="w-[40vw] overflow-x-auto"></div>
        </TypographySmall>
      </div>
    </Card>
  );
}
