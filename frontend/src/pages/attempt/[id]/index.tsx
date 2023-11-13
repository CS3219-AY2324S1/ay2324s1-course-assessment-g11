import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypographyBody, TypographyCode, TypographyH2 } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Attempt } from "@/types/UserTypes";
import { useHistory } from "@/hooks/useHistory";
import { useQuestions } from "@/hooks/useQuestions";
import { Question } from "@/types/QuestionTypes";
import { DotWave } from "@uiball/loaders";

export default function Page() {
  const router = useRouter();
  const attemptId = router.query.id;
  const { fetchAttempt } = useHistory();
  const { fetchQuestion } = useQuestions();
  const [attempt, setAttempt] = useState<Attempt>();
  const [question, setQuestion] = useState<Question>();
  const [loadingState, setLoadingState] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    if (!attemptId) return;
    if (Array.isArray(attemptId)) {
      router.push("/profile");
      return;
    }
    fetchAttempt(attemptId).then((attempt) => {
      if (attempt) {
        setAttempt(attempt);
        return fetchQuestion(attempt.question_id);
      } else {
        throw new Error("Attempt not found");
      }
    }).then((question) => {
      if (question) {
        setQuestion(question);
        setLoadingState("success");
      } else {
        throw new Error("Question not found");
      }
    }).catch((err: any) => {
      setLoadingState("error");
      console.log(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  if (attemptId === undefined || Array.isArray(attemptId)) {
    return null;
  }

  return (
    <div className="min-h-screen p-12 mx-auto max-w-3xl flex flex-col gap-8">
      <div className="flex gap-x-4 items-center">
        <Button className="gap-2" size="sm" variant="ghost" onClick={router.back}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <TypographyH2>Attempt</TypographyH2>
      </div>

      { loadingState === "loading" ? <div className="h-32 flex items-center justify-center">
        <DotWave
          size={47}
          speed={1}
          color="white"
        /></div> : loadingState === "error" ? <TypographyBody>Error</TypographyBody> : <>
      <div>
        <Label className="text-primary">Question</Label>
        <TypographyBody>{question?.title}</TypographyBody>
      </div>

      <div>
        <Label className="text-primary">Attempted At</Label>
        <TypographyBody>{attempt?.time_updated.toLocaleString()}</TypographyBody>
      </div>

      <div>
        <Label className="text-primary">Mode of Attempt</Label>
        <TypographyBody>{attempt?.room_id ? "Interview" : "Solo"}</TypographyBody>
      </div>

      <div>
        <Label className="text-primary">Solution</Label>
        <TypographyBody>{attempt?.solved ? "Solved": "Unsolved"}</TypographyBody>
        <Textarea disabled={true} className="my-4" defaultValue={attempt?.answer || ""}>
        </Textarea>
      </div></>}
    </div> 
  )
}
