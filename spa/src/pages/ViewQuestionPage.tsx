import Description from "../components/questions/description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TypographyBody } from "../components/ui/typography";
import { useEffect, useState } from "react";
import { Question } from "../types/QuestionTypes";
import { MrMiyagi } from "@uiball/loaders";
import { Link, useParams } from "react-router-dom";
import useReadLocalStorage from "usehooks-ts/dist/esm/useReadLocalStorage/useReadLocalStorage";
import { ChevronLeft } from "lucide-react";

export default function ViewQuestionPage() {
  const params = useParams<{ questionId: string }>();
  const questionIndex: number = parseInt(params.questionId ?? '');
  const questions = useReadLocalStorage<Array<Question>>('questions') ?? []
  const [question] = useState<Question | null>(questions[questionIndex] ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [questionIndex]);

  if (question === null && !loading) {
    return <div className="flex items-center justify-center h-screen">Question not found</div>;
  }

  return (
    <div className="h-screen px-12 py-6">
      {question === null || loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <MrMiyagi size={35} lineWeight={3.5} speed={1} color="white" />
        </div>
      ) : (
        <div className="flex h-full">
          <Link to="/">
            <ChevronLeft className="w-6 h-6 mt-2" />
          </Link>
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
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
