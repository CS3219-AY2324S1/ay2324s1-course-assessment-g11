import { Room } from "twilio-video";
import { Question } from "../../types/QuestionTypes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";
import VideoRoom from "./video-room";

// todo change this

type DescriptionProps = {
  question: Question;
  className?: string;
  participants?: string[];
  room: Room | null;
};

export default function Description({
  question,
  className,
}: DescriptionProps) {
  return (
    <Card className={`m-2 ml-0 px-6 h-full ${className} overflow-y-auto overflow-x-wrap pb-4`}>
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex gap-4 items-center justify-center">
          <TypographyH2>{question.title}</TypographyH2>
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
          <Badge variant="outline" className="" key={tag}>
            <TypographySmall>{tag}</TypographySmall>
          </Badge>
        ))}
      </div>
      <div className="py-6">
        <TypographySmall>
          <div dangerouslySetInnerHTML={{ __html: question.description }} className="max-w-2xl overflow-x-auto"></div>
        </TypographySmall>
      </div>
    </Card>
  );
}
