import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Question } from "../../../types/QuestionTypes";
import { AuthContext } from "@/contexts/AuthContext";
import { fetchQuestion } from "../../api/questionHandler";
import { MrMiyagi } from "@uiball/loaders";
import { useHistory } from "@/hooks/useHistory";
import Solution from "@/components/room/solution";
import { useUser } from "@/hooks/useUser";
import { EditableUser } from "@/types/UserTypes";

export default function Questions() {
  const router = useRouter();
  const { postAttempt } = useHistory();
  const questionId = router.query.id as string;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true); // to be used later for loading states
  const [answer, setAnswer] = useState("");

  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const [ansCache, setAnsCache] = useState<Record<any, any>>({});

  // fetch user preferences
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const { getAppUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      getAppUser().then((user) => {
        if (user) {
          setSelectedLanguage(
            user.matchProgrammingLanguage || selectedLanguage
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (!authIsReady || !questionId) {
      console.log("auth not ready or questionId not found");
      return;
    }
    if (currentUser) {
      fetchQuestion(currentUser, questionId)
        .then((question) => {
          if (question) {
            setQuestion(question);
            setAnsCache({
              python: question.defaultCode.python || "",
              java: question.defaultCode.java || " ",
              "c++": question.defaultCode["c++"] || "",
            });
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

  const updateLanguage = useCallback(
    (framework: string) => {
      if (question && question.defaultCode) {
        setAnswer(ansCache[framework]);
      }
    },
    [ansCache, question]
  );

  function onSubmitClick(value: string, solved: boolean) {
    postAttempt({
      uid: currentUser ? currentUser.uid : "user",
      question_id: questionId,
      answer: value || answer,
      solved: solved, // assume true
    })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        router.push("/profile");
      });
  }

  if (question === null && !loading) return <p>Question not found</p>;

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
              <Description
                question={question}
                className="h-full"
                hasRoom={false}
              />
            </TabsContent>
            <TabsContent value="solution">
              <Solution
                question={question}
                className="h-full"
                hasRoom={false}
              />
            </TabsContent>
          </Tabs>
          <div className="flex-1">
            <CodeEditor
              language={selectedLanguage}
              onLanguageChange={updateLanguage}
              defaultValue={question.defaultCode.python}
              onChange={setAnswer}
              text={answer}
              hasRoom={false}
              onSubmitClick={onSubmitClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
