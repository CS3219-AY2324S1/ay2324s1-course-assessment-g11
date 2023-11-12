import Description from "../components/questions/description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TypographyBody } from "../components/ui/typography";
import { useEffect, useState } from "react";
import { Question } from "../types/QuestionTypes";
import { MrMiyagi } from "@uiball/loaders";
import { useParams } from "react-router-dom";

export default function ViewQuestionPage() {
  const questionId = useParams<{ questionId: string }>().questionId;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuestion(question);
    setLoading(false);
  }, [questionId]);

  if (question === null && !loading) {
    return <div className="flex items-center justify-center">Question not found</div>;
  }

  return (
    <div className="h-[calc(100vh-80px)] px-12 py-6">
      {question === null || loading ? (
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
            </TabsList>
            <TabsContent value="description" className="h-[79vh]">
              <Description
                question={question}
                className="h-full"
                hasRoom={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
