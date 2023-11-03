import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Question } from "../../../types/QuestionTypes";
import { AuthContext } from "@/contexts/AuthContext";
import { fetchQuestion } from "../../api/questionHandler";
import { MrMiyagi } from "@uiball/loaders";

export default function Questions() {
  const router = useRouter();
  const questionId = router.query.id as string;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true); // to be used later for loading states
  const [answer, setAnswer] = useState("");

  const { user: currentUser, authIsReady } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      fetchQuestion(currentUser, questionId)
        .then((question) => {
          if (question) {
            setQuestion(question);
          }
        })
        .catch((err) => {
          console.log(err);
          router.push("/");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // if user is not logged in, redirect to home
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, authIsReady, currentUser]);

  if (question === null && !loading) return <p>Question not found</p>;

  // implement some on change solo save logic here - user side most likely

  return (
    <div className="h-[calc(100vh-80px)] px-12 py-6">
      {!router.isReady || question === null || loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <MrMiyagi size={35} lineWeight={3.5} speed={1} color="white" />
        </div>
      ) : (
        <div className="flex h-full">
          <Tabs defaultValue="description" className="flex-1">
            <TabsList>
              <TabsTrigger value="description">
                <TypographyBody>Description</TypographyBody>
              </TabsTrigger>
              <TabsTrigger value="solution">
                <TypographyBody>Solution</TypographyBody>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="h-[79vh]">
              <Description question={question} className="h-full" />
            </TabsContent>
            <TabsContent value="solution">{question.solution}</TabsContent>
          </Tabs>
          <div className="flex-1">
            <CodeEditor
              defaultValue={question.defaultCode.python}
              onChange={setAnswer}
              text={answer}
              hasRoom={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
