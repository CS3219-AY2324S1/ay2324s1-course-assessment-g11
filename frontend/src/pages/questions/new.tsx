import { Button } from "@/components/ui/button";

import { TypographyH2 } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuestionsForm from "./_form";
import { useQuestions } from "@/hooks/useQuestions";
import { useState } from "react";
import { useRouter } from "next/router";

const formSchema = z.object({
  title: z.string().min(2).max(100),
  difficulty: z.enum(["easy", "medium", "hard"]),
  topics: z.array(z.string().min(2).max(100)),
  content: z.string().min(2).max(1000),
  language: z.enum(["javascript", "python", "java", "c++"]),
  defaultCode: z.string().min(0).max(10000) || undefined,
});

export default function NewQuestion() {
  const { postNewQuestion } = useQuestions();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "easy",
      topics: [],
      content: "",
      language: "python",
      defaultCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const new_vals = {
      ...values,
      testCaseInputs: [""],
      testCaseOutputs: [""],
      solution: { python: values.defaultCode },
      defaultCode: {
        python: "print('Hello World')",
      },
    };
    setLoading(true);
    try {
      const res = await postNewQuestion(new_vals);
      setLoading(false);
      console.log(res);
      console.log("Question successfully added");
      // redirect to question page
      router.push(`/questions/${res.title.split(" ").join("-")}`);
    } catch (error) {
      console.error(error);
      // display error to user
    }
  }

  return (
    <div className="min-h-screen p-12 mx-auto max-w-3xl">
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
