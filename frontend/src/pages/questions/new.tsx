import { Button } from "@/components/ui/button";

import { TypographyH2 } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuestionsForm, { formSchema } from "./_form";
import { useContext, useEffect, useState } from "react";
import { useQuestions } from "../../hooks/useQuestions";
import { AuthContext } from "@/contexts/AuthContext";

export default function NewQuestion() {
  const { postNewQuestion } = useQuestions();
  const [loading, setLoading] = useState(false);
  const { user: currentUser, authIsReady, isAdmin } = useContext(AuthContext);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "easy",
      topics: [],
      description: "",
      testCasesInputs: [],
      testCasesOutputs: [],
      solution: {python: ""},
    },
  });

  useEffect(() => {
    if (!authIsReady) {
      return;
    }
    if (!currentUser || !isAdmin) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authIsReady, currentUser])


  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    postNewQuestion(values)
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

  return (
    <div className="min-h-screen p-12 mx-auto max-w-6xl">
      <div className="flex gap-x-4 items-center">
        <Link href="/questions">
          <Button className="gap-2" size="sm" variant="ghost">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <TypographyH2>Add a Question</TypographyH2>
      </div>
      <QuestionsForm form={form} onSubmit={onSubmit} loading={loading} />
    </div>
  );
}
