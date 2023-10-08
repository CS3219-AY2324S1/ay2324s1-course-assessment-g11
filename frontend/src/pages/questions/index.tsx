import {
  TypographyBodyHeavy,
  TypographyH1,
  TypographyH2,
  TypographySmall,
} from "@/components/ui/typography";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import DifficultySelector from "@/components/common/difficulty-selector";
import { columns } from "@/components/questions/columns";
import { DataTable } from "@/components/questions/data-table";
import { Difficulty, Question } from "../../../types/QuestionTypes";
import { questionApiPathAddress } from "@/firebase-client/gateway-address";
import { AuthContext } from "@/contexts/AuthContext";
import { PlusIcon } from "lucide-react";

export default function Questions() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [questions, setQuestions] = useState<Question[]>([]);
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      const url = `${questionApiPathAddress}list`;
      console.log(currentUser, authIsReady);
      currentUser.getIdToken(true).then((idToken) => {
        fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "User-Id-Token": idToken,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data && data.questions) {
              console.log(data);
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
      });
    } else {
      console.log("You are most likely not logged in");
    }
  }, [currentUser, authIsReady]);

  return (
    <div className="min-h-screen p-12 mx-auto max-w-7xl">
      <div className='flex justify-between items-center'>
        <div>
          <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
            Questions
          </TypographyH1>
          <TypographyBodyHeavy>
            Practice our questions to ace your coding interview!
          </TypographyBodyHeavy>
        </div>
        <Link href="/questions/new">
          <Button className='gap-2'>
            <PlusIcon />
            Contribute question
          </Button>
        </Link>
      </div>

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
