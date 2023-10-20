import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Question } from "../../../types/QuestionTypes";
import { AuthContext } from "@/contexts/AuthContext";
import { fetchQuestion } from "../../api/questionHandler";

export default function Room() {
  const router = useRouter();
  const questionId = router.query.id as string;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true); // to be used later for loading states
  const [answer, setAnswer] = useState("");

  const { user: currentUser, authIsReady } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      fetchQuestion(currentUser, questionId).then(question => {
        if (question) {
          setQuestion(question);
        } else {
          // if question is not found, redirect to home
          router.push("/");
        }
      }).catch(err => {
        console.log(err);
        router.push("/");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // if user is not logged in, redirect to home
      router.push("/");
    }
  }, [questionId, authIsReady, currentUser]);

  if (!router.isReady || question === null) return null;

  // implement some on change solo save logic here - user side most likely

  return (
    <div className="h-[calc(100vh-80px)] px-12 py-6">
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
            <Description
              question={question}
              className="h-full"
            />
          </TabsContent>
          <TabsContent value="solution">{question.solution}</TabsContent>
        </Tabs>
        <div className="flex-1">
          <CodeEditor
            defaultValue={question.defaultCode.python}
            onChange={setAnswer}
            text={answer}
          />
        </div>
      </div>
    </div>
  );
}
