import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import useCollaboration from "@/hooks/useCollaboration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import VideoRoom from "../../components/room/video-room";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { useQuestions } from "@/hooks/useQuestions";
import { useContext, useEffect, useState } from "react";
import { MrMiyagi } from "@uiball/loaders";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import Solution from "@/components/room/solution";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Room() {
  const router = useRouter();
  const roomId = router.query.id as string;
  const { user: currentUser } = useContext(AuthContext);
  const userId = (currentUser?.uid as string) || "user1";
  const disableVideo =
    (router.query.disableVideo as string)?.toLowerCase() === "true";

  const {
    text,
    setText,
    cursor,
    setCursor,
    room,
    questionId,
    setQuestionId,
    disconnect,
  } = useCollaboration({
    roomId: roomId as string,
    userId,
    disableVideo,
  });

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true); // to be used later for loading states

  const { fetchQuestion, fetchRandomQuestion } = useQuestions();
  const { match, leaveMatch, changeQuestion, requestToChangeQuestion, setRequestToChangeQuestion } = useMatchmaking();

  useEffect(() => {
    if (match && match.questionId !== null) {
      const questionId = match.questionId;
      setQuestionId(questionId);
      fetchQuestion(questionId).then((fetchQuestion) => {
        if (fetchQuestion) {
          setQuestion(fetchQuestion);
        }
      });
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!match) {
      // leave room and redirect to interviews page
      timeout = setTimeout(() => {
        leaveMatch();
        toast.info("Other user has left");
        router.push("/interviews");
      }, 5000);
    }

    setLoading(false);
    return () => {
      if (timeout) clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, questionId]);

  function handleSwapQuestionClick(): void {
    if (match) {
      setLoading(true);
      const difficulty = (match.chosenDifficulty || "easy") as Difficulty;
      fetchRandomQuestion(difficulty)
        .then((question) => {
          if (question) {
            changeQuestion(question.id, question.title, roomId);
            toast.info("Please wait for other user to accept.");
          }
        })
        .catch((err) => {
          console.log(err);
          router.push("/");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function onLeaveRoomClick(): void {
    disconnect();
    leaveMatch();
    router.push("/interviews");
  }

  function replyToChangeRequest(accept: boolean): void {
    if (requestToChangeQuestion) {
      requestToChangeQuestion.cb(accept);
      setRequestToChangeQuestion(null);
    }
  }

  return (
    <div>
      {!router.isReady ? (
        <div className="flex w-full h-full justify-center items-center">
          <MrMiyagi size={35} lineWeight={3.5} speed={1} color="white" />
        </div>
      ) : (
        <div>
          {requestToChangeQuestion && (<AlertDialog defaultOpen={true}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Do you agree to this change?</AlertDialogTitle>
                <AlertDialogDescription>
                The other user requested to change question to {requestToChangeQuestion.questionTitle}. 
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => replyToChangeRequest(true)}>
                  Yes
                </AlertDialogAction>
                <AlertDialogAction onClick={() => replyToChangeRequest(false)}>
                  No
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>)}
          
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
                  {loading ? (
                    <div className="flex h-full justify-center items-center">
                      <MrMiyagi
                        size={35}
                        lineWeight={3.5}
                        speed={1}
                        color="white"
                      />
                    </div>
                  ) : question !== null ? (
                    <Description
                      question={question}
                      onSwapQuestionClick={handleSwapQuestionClick}
                    />
                  ) : (
                    <div className="flex h-full justify-center items-center">
                      <MrMiyagi
                        size={35}
                        lineWeight={3.5}
                        speed={1}
                        color="white"
                      />
                    </div>
                  )}
                </TabsContent>
                {loading ? (
                  <div className="flex h-full justify-center items-center">
                    <MrMiyagi
                      size={35}
                      lineWeight={3.5}
                      speed={1}
                      color="white"
                    />
                  </div>
                ) : question != null && "solution" in question ? (
                  <TabsContent value="solution">
                    <Solution question={question} />
                  </TabsContent>
                ) : (
                  <div className="flex h-full justify-center items-center">
                    <MrMiyagi
                      size={35}
                      lineWeight={3.5}
                      speed={1}
                      color="white"
                    />
                  </div>
                )}
              </Tabs>
              <div className="flex-1">
                <CodeEditor
                  text={text}
                  language={match?.chosenProgrammingLanguage || "python"}
                  cursor={cursor}
                  onChange={setText}
                  onCursorChange={setCursor}
                  onLeaveRoomClick={onLeaveRoomClick}
                />
              </div>
            </div>
            <VideoRoom className="bottom-0.5 left-0.5 fixed" room={room} />
          </div>
        </div>
      )}
    </div>
  );
}
