import {
  TypographyBodyHeavy,
  TypographyH1,
  TypographyH2,
  TypographySmall,
} from "@/components/ui/typography";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import DifficultySelector from "@/components/common/difficulty-selector";
import { columns, Question } from "@/components/questions/columns";
import { DataTable } from "@/components/questions/data-table";
import { Difficulty } from "../../../types/QuestionTypes";

export default function Questions() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const url = "http://localhost:5002/api/question-service/list";

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.questions) {
          setQuestions(
            data.questions.map((question: any) => ({
              title: question.title,
              difficulty: question.difficulty,
              tags: question.topics,
            }))
          );
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the questions", error);
      });
  }, []);

  return (
    <div className="min-h-screen p-12 mx-auto max-w-7xl">
      <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
        Questions
      </TypographyH1>

      <TypographyBodyHeavy>
        Practice our questions to ace your coding interview!
      </TypographyBodyHeavy>

      <div className="flex-col flex gap-4 py-20">
        <TypographyH2 className="text-primary">Quick Practice</TypographyH2>
        <div>
          <TypographySmall>Choose question difficulty</TypographySmall>
          <DifficultySelector
            onChange={(value) => setDifficulty(value)}
            showAny={true}
            defaultValue={difficulty}
          />
        </div>
        <Link href="/room">
          <Button variant={"outline"}>Give me a random question!</Button>
        </Link>
      </div>

      <div className="flex-col flex gap-4 py-12">
        <TypographyH2 className="text-primary">All Questions</TypographyH2>
        <DataTable columns={columns} data={questions} />
      </div>
    </div>
  );
}
