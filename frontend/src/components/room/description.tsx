import { Question } from "../../../types/QuestionTypes";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";
import { Video, Mic } from "lucide-react";

// todo change this

type DescriptionProps = {
  question: Question;
  className?: string;
  participants?: string[];
};

export default function Description({
  question,
  className,
  participants,
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
      {/* <div className="flex gap-4 absolute bottom-10">
        {participants?.map((participant) => (
          <div
            className="flex items-center justify-start gap-4"
            key={participant}
          >
            <div className="w-64 h-36 p-2 flex flex-col items-center justify-center border border-primary rounded-lg">
              <div className="w-full h-full items-center justify-center flex"></div>
              <div className="flex-1 ml-1 w-full h-8 flex items-center justify-between">
                <p>{participant}</p>
                <div className="flex flex-row gap-2 justify-end">
                  <Button variant="ghost" size="icon">
                    <Video />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Mic />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </Card>
  );
}
