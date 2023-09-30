import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypographyH2, TypographySmall } from "../ui/typography";
import { Video, Mic } from "lucide-react";

type Question = {
  title: string;
  difficulty: string;
  tags: string[];
  description: string;
  solution: string;
}

type DescriptionProps = {
  question: Question;
  className?: string;
}

export default function Description({ question, className }: DescriptionProps) {
  return (
    <Card className={`m-2 ml-0 px-6 h-full ${className}`}>
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex gap-4 items-center justify-center">
          <TypographyH2>{question.title}</TypographyH2>
          <Badge variant="secondary" className="h-min">
            <TypographySmall className="text-[#27CA40]">{question.difficulty}</TypographySmall>
          </Badge>
        </div>
        <Button variant="secondary">
          Swap Question
        </Button>
      </div>
      <div className="flex gap-2">
        {question.tags.map((tag) => (
          <Badge variant="outline" className="" key={tag}>
            <TypographySmall>{tag}</TypographySmall>
          </Badge>
        ))}
      </div>
      <div className="py-2">
        <TypographySmall>{question.description}</TypographySmall>
      </div>
    </Card>
  );
}