import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import useCollaboration from "@/hooks/useCollaboration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import VideoRoom from "../../components/room/video-room";
import { Question } from "../../types/QuestionTypes";

export default function Room() {
  const router = useRouter();

  const roomId = router.query.id as string;
  const userId = router.query.userId as string || "user1";
  const disableVideo = (router.query.disableVideo as string)?.toLowerCase() === "true";

  const { text, setText, cursor, setCursor, room } = useCollaboration({
    roomId: roomId as string,
    userId,
    disableVideo,
  });

  const question: Question = {
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    solution:
      "var twoSum = function(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n};",
    defaultCode: { python: "var twoSum = function(nums, target) {\n\n};" },
  };

  if (!router.isReady) return null;

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
            />
          </TabsContent>
          <TabsContent value="solution">{question.solution}</TabsContent>
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
  );
}
