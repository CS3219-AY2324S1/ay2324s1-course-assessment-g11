import { TypographyH2 } from "../components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuestionsForm, { formSchema } from "../components/questions/form";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useParams } from "react-router-dom";
import { useReadLocalStorage, useLocalStorage } from "usehooks-ts";
import { Question } from "../../types/QuestionTypes";


export default function EditQuestionPage() {
  const navigate = useNavigate();
  const params = useParams<{ questionId: string }>();
  const questionIndex: number = parseInt(params.questionId ?? '');
  const questions = useReadLocalStorage<Array<Question>>('questions') ?? []
  const [, setNewQuestions] = useLocalStorage('questions', questions)
  const [question] = useState<Question | null>(questions[questionIndex] ?? null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "easy",
      description: "",
      category: "",
    },
  });

  useEffect(() => {
    if (question) {
      form.setValue("title", question.title);
      form.setValue("difficulty", question.difficulty as any);
      form.setValue("description", question.description);
      form.setValue("category", question.category);
    } 

    setLoading(false);
  }, [questionIndex]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isQuestionDuplicate(values)) {
      alert("Question with this title already exists");
      return;
    }
    setLoading(true);
    putQuestion(values, questionIndex as number)
    setLoading(false);
    alert("Question has been updated");
  }

  function onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this question?")) {
      setLoading(true);
      deleteQuestion(questionIndex)
      setLoading(false);
      navigate("/");
      alert("Successfully deleted question");
    }
  }

  function isQuestionDuplicate(newQuestion: z.infer<typeof formSchema>) {
    for(let i = 0; i < questions.length; i++) {
      if (questions[i].title.toLowerCase().trim() === newQuestion.title.toLowerCase().trim() && i !== questionIndex) {
        return true;
      }
    }
  }

  function putQuestion(question: z.infer<typeof formSchema>, questionIndex: number) {
    const newQuestions = questions.map((q, index) => {
      if (index === questionIndex) {
        return {
          ...question,
        } as Question
      }
      return q
    });
    setNewQuestions(newQuestions);
  }

  function deleteQuestion(questionIndex: number) {
    const newQuestions = questions.filter((question, index) => index !== questionIndex);
    setNewQuestions(newQuestions);
  }

  if (!question) {
    return <div className="flex items-center justify-center h-screen">Question not found</div>;
  }

  return (
    question &&
    <div className="min-h-screen p-12 mx-auto max-w-3xl">
      <div className="flex gap-x-4 items-center">
        <Link to="/">
          <Button className="gap-2" size="sm" variant="ghost">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <TypographyH2>Edit a Question</TypographyH2>
      </div>
      <QuestionsForm form={form} onSubmit={onSubmit} onDelete={onDelete} loading={loading} type="edit" />
    </div>
  );
}
