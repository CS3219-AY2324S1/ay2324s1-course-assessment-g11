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
import { getColumnDefs } from "@/components/questions/columns";
import { DataTable } from "@/components/questions/data-table";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { AuthContext } from "@/contexts/AuthContext";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useQuestions } from "@/hooks/useQuestions";

export default function Questions() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const { fetchQuestions, fetchRandomQuestion } = useQuestions();

  useEffect(() => {
    if (currentUser) {
      fetchQuestions()
        .then((questions) => {
          if (!questions) {
            throw new Error("Cannot fetch questions");
          }
          setQuestions(questions);
          loading && setLoading(false);
        })
        .catch((error) => {
          console.error("There was an error fetching the questions", error);
        });
    } else {
      console.log("You are most likely not logged in");
    }
  }, [currentUser]);

  const onClickRandomQuestion = async () => {
    try {
      const question: [Question] = await fetchRandomQuestion(difficulty);
      console.log(question);
      if (question[0]?.id) {
        router.push(`/questions/${question[0].id}`);
      } else {
        console.error("Received undefined question or question without title.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-12 mx-auto max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
            Questions
          </TypographyH1>
          <TypographyBodyHeavy>
            Practice our questions to ace your coding interview!
          </TypographyBodyHeavy>
        </div>
        <Link href="/questions/new">
          <Button className="gap-2">
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
        <Link href="">
          <Button variant={"outline"} onClick={onClickRandomQuestion}>
            Give me a random question!
          </Button>
        </Link>
      </div>

      <div className="flex-col flex gap-4 py-12">
        <TypographyH2 className="text-primary">My Contributed Questions</TypographyH2>
        <DataTable columns={getColumnDefs(true)} data={questions.filter(q => q.author === currentUser?.uid)} loading={loading} />
      </div>

      <div className="flex-col flex gap-4 py-12">
        <TypographyH2 className="text-primary">All Questions</TypographyH2>
        <DataTable columns={getColumnDefs(false)} data={questions} loading={loading} />
      </div>
    </div>
  );
}
