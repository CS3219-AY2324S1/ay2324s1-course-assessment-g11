import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import useCollaboration from "@/hooks/useCollaboration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import VideoRoom from "../../components/room/video-room";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { Match } from "../../types/MatchTypes";
import { useQuestions } from "@/hooks/useQuestions";
import { useMatch } from "@/hooks/useMatch";
import { useEffect, useState } from "react";
import { MrMiyagi } from "@uiball/loaders";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import Solution from "@/components/room/solution";

export default function Room() {
  const router = useRouter();
  const roomId = router.query.id as string;
  const userId = (router.query.userId as string) || "user1";
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
  const { updateQuestionIdInMatch } = useMatch();
  const { match, leaveMatch } = useMatchmaking();

  useEffect(() => {
    if (match && match.questionId !== null) {
      const questionId = match.questionId;
      setQuestionId(questionId);
    }

    if (questionId !== "") {
      fetchQuestion(questionId).then((fetchQuestion) => {
        if (fetchQuestion != null) {
          setQuestion(fetchQuestion);
        }
      });
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, questionId]);

  function handleSwapQuestionClick(): void {
    if (match) {
      setLoading(true);
      const difficulty = (match.chosenDifficulty || "easy") as Difficulty;
      fetchRandomQuestion(difficulty)
        .then((question) => {
          if (question) {
            updateQuestionIdInMatch(roomId, question.id);
            setQuestion(question);
            setQuestionId(question.id);
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

  return (
    <div>
      {!router.isReady ? (
        <div className="flex w-full h-full justify-center items-center">
          <MrMiyagi size={35} lineWeight={3.5} speed={1} color="white" />
        </div>
      ) : (
        <div>
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
                    <Solution
                      question={question}
                    />
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
