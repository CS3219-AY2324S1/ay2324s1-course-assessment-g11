import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import DifficultySelector from "@/components/common/difficulty-selector";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(2).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string().min(2).max(100)),
  description: z.string().min(2).max(1000),
  language: z.enum(['javascript', 'python', 'java', 'c++']),
  code: z.string().min(2).max(10000) || undefined,
})

export default function QuestionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "easy",
      tags: [],
      description: "",
      language: "python",
      code: "",
    },
  })

  const topics = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
    {
      value: "wordpress",
      label: "WordPress",
    },
    {
      value: "express.js",
      label: "Express.js",
    }
  ]

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className='min-h-screen p-12 mx-auto max-w-3xl'>
      <div className="flex gap-x-4 items-center">
        <Link href="/questions">
          <Button className='gap-2' size='sm' variant='ghost'>
            <ArrowLeft className='w-6 h-6' />
          </Button>
        </Link>
        <TypographyH2>Add a Question</TypographyH2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Title</FormLabel>
                <FormControl>
                  <Input placeholder="eg. Two Sum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <FormControl>
                  <DifficultySelector onChange={(value) => form.setValue('difficulty', value != "any" ? value : "easy")} showAny={false} defaultValue={form.getValues().difficulty} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Frameworks</FormLabel>
                <MultiSelect
                  selected={field.value}
                  options={topics}
                  {...field}
                  className="sm:w-[510px]"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your question here."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
