import { TypographyH2 } from "../components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useRouter } from "next/router";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuestionsForm, { formSchema } from "../components/questions/form";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

export default function EditQuestionPage() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id: questionId } = router.query;

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
    const question = {
      title: "Two Sum",
      difficulty: "easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
      category: "Array",
    };

    if (question) {
      form.setValue("title", question.title);
      form.setValue("difficulty", question.difficulty as any);
      form.setValue("description", question.description);
    } else {
      // if question is not found, redirect to home
      router.push("/");
    }

    setLoading(false);
  }, [questionId]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log("Submitting", values)
    // putQuestion(values, questionId as string)
    setLoading(false);
    alert("Success");
    router.push("/questions");
  }

  function onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this question?")) {
      setLoading(true);
      // deleteQuestion(questionId as string)
      setLoading(false);
      alert("Successfully deleted question");
      router.push("/questions");
    }
  }

  return (
    questionId &&
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
