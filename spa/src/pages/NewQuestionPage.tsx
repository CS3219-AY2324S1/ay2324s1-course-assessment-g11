import React from "react";
import { Button } from "../components/ui/button";

import { TypographyH2 } from "../components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QuestionsForm, { formSchema } from "../components/questions/form";
import { useState } from "react";


export default function NewQuestion() {

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "easy",
      description: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-12 mx-auto max-w-3xl">
      <div className="flex gap-x-4 items-center">
        <Link to="/">
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
