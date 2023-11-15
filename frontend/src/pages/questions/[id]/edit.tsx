import { TypographyH2 } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuestionsForm, { formSchema } from "../_form";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { deleteQuestion, fetchQuestion, putQuestion } from "../../api/questionHandler";
import { AuthContext } from "@/contexts/AuthContext";

export default function EditQuestion() {
  const [loading, setLoading] = useState(true);
  const { user: currentUser, authIsReady, isAdmin } = useContext(AuthContext);
  
  const router = useRouter();
  const { id: questionId } = router.query;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "easy",
      topics: [],
      description: "",
      testCasesInputs: [],
      testCasesOutputs: [],
    },
  });

  useEffect(() => {
    if (!questionId || !authIsReady) {
      return;
    }
    if (currentUser) {
      // Note, non-admins will be able to see the form but should not be able to update the question
      // This is done to trigger the backend authorization failure messages.
      fetchQuestion(currentUser, questionId as string).then(question => {
        if (question) {
          form.setValue("title", question.title);
          form.setValue("difficulty", question.difficulty as any);
          form.setValue("topics", question.topics);
          form.setValue("description", question.description);
          form.setValue("defaultCode", {python: "", java: "", "c++": "", ...question.defaultCode});
          form.setValue("testCasesInputs", question.testCasesInputs || []);
          form.setValue("testCasesOutputs", question.testCasesOutputs || []);
        } else {
          // if question is not found, redirect to home
          router.push("/");
        }
      }).catch(err => {
        console.log(err);
        router.push("/");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // if user is not logged in or is not admin, redirect to home
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, authIsReady, currentUser]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log("Submitting", values)
    putQuestion(currentUser, values, questionId as string)
      .then(() => {
        setLoading(false);
        alert("Success");
        router.push("/questions");
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  }

  function onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this question?")) {
      setLoading(true);
      deleteQuestion(currentUser, questionId as string)
        .then(() => {
          setLoading(false);
          alert("Successfully deleted question");
          router.push("/questions");
        })
        .catch((err) => {
          setLoading(false);
          alert(err.message);
        });
    }
  }

  return (
    questionId &&
    <div className="min-h-screen p-12 mx-auto max-w-3xl">
      <div className="flex gap-x-4 items-center">
        <Link href="/questions">
          <Button className="gap-2" size="sm" variant="ghost">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <TypographyH2>{isAdmin ? 'Edit a Question' : 'Try to Edit question'}</TypographyH2>
      </div>
      <QuestionsForm form={form} onSubmit={onSubmit} onDelete={onDelete} loading={loading} type="edit" />
    </div>
  );
}
