import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Question } from "../../../types/QuestionTypes";
import { questionApiPathAddress } from "@/firebase-client/gateway-address";
import { AuthContext } from "@/contexts/AuthContext";
import { MrMiyagi } from '@uiball/loaders'

export default function Questions() {
  const router = useRouter();
  const questionTitle = router.query.id as string;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true); // to be used later for loading states
  const [answer, setAnswer] = useState("");

  const { user: currentUser, authIsReady } = useContext(AuthContext);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        const url = `${questionApiPathAddress}question/${questionTitle}`;

        try {
          const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "User-Id-Token": idToken,
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          setQuestion({
            title: data.title,
            difficulty: data.difficulty,
            topics: data.topics,
            description: data.content,
            solution: data.solutionCode,
            defaultCode: data.defaultCode,
          });
        } catch (error) {
          console.error("There was an error fetching the questions", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("You are not logged in");
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionTitle, authIsReady, currentUser]);

  // implement some on change solo save logic here - user side most likely

  return (
    <div className="h-[calc(100vh-80px)] px-12 py-6">
      {!router.isReady || question === null || loading ?
        <div className="flex w-full h-full justify-center items-center">
          <MrMiyagi
            size={35}
            lineWeight={3.5}
            speed={1}
            color="white"
          />
        </div> :
        (
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
        )}
    </div>
  );
}
