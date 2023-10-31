import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import useCollaboration from "@/hooks/useCollaboration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import VideoRoom from "../../components/room/video-room";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { useQuestions } from "@/hooks/useQuestions";
import { useMatch } from "@/hooks/useMatch";
import { useEffect, useState } from "react";
import { MrMiyagi } from "@uiball/loaders";

export default function Room() {
  const router = useRouter();
  const roomId = router.query.id as string;
  const userId = (router.query.userId as string) || "user1";
  const disableVideo =
    (router.query.disableVideo as string)?.toLowerCase() === "true";

  const { text, setText, cursor, setCursor, room, setQuestionId } =
    useCollaboration({
      roomId: roomId as string,
      userId,
      disableVideo,
    });

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true); // to be used later for loading states

  const defaultQuestion: Question = {
    title: "Example Question: Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    solution:
      "var twoSum = function(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n};",
    defaultCode: { python: "var twoSum = function(nums, target) {\n\n};" },
    id: "",
    author: "",
  };

  const { fetchQuestion, fetchRandomQuestion } = useQuestions();
  const { getMatch, updateQuestionIdInMatch } = useMatch();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    getMatch(roomId)
      .then((match) => {
        if (match && match.questionId != null) {
          setMatch(match);
          const questionId = match.questionId;
          fetchQuestion(questionId).then((fetchQuestion) => {
            if (fetchQuestion != null) {
              setQuestion(fetchQuestion);
              setQuestionId(fetchQuestion.id);
              console.log(questionId);
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

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
            console.log(question.id);
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
                  ) : question != null ? (
                    <Description
                      question={question}
                      onSwapQuestionClick={handleSwapQuestionClick}
                    />
                  ) : (
                    <Description
                      question={defaultQuestion}
                      onSwapQuestionClick={handleSwapQuestionClick}
                    />
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
                    {question.solution}
                  </TabsContent>
                ) : (
                  <TabsContent value="solution">
                    {defaultQuestion.solution}
                  </TabsContent>
                )}
              </Tabs>
              <div className="flex-1">
                <CodeEditor
                  text={text}
                  cursor={cursor}
                  onChange={setText}
                  onCursorChange={setCursor}
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
