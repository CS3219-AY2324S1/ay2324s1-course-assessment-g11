import CodeEditor from "@/components/room/code-editor";
import Description from "@/components/room/description";
import { useQuestion } from "@/hooks/useQuestion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Question } from "../../../types/QuestionTypes";

export default function Room() {
  const router = useRouter();
  const questionTitle = router.query.id as string;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    const fetchQuestion = async () => {
      const url = `http://localhost:5002/api/question-service/question/${questionTitle}`;

      console.log(url);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setQuestion({
          title: data.title,
          difficulty: data.difficulty,
          tags: data.topics,
          description: data.content,
          solution: data.solutionCode,
          defaultCode: data.defaultCode,
        });
      } catch (error) {
        console.error("There was an error fetching the questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionTitle]);

  if (!router.isReady || question === null) return null;

  // const question: Question = {
  //   title: "Two Sum",
  //   difficulty: "Easy",
  //   tags: ["Array", "Hash Table"],
  //   description:
  //     "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
  //   solution:
  //     "var twoSum = function(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n};",
  // };

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
              participants={["Charisma", "Chun Wei"]}
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
