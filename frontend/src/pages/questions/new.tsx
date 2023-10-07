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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import DifficultySelector from "@/components/common/difficulty-selector";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string().min(2).max(100)),
  description: z.string().min(2).max(1000),
  language: z.enum(['javascript', 'python', 'java', 'c++']),
  code: z.string().min(0).max(10000) || undefined,
})

export default function QuestionForm() {
  const [hasSolution, setHasSolution] = useState(false)

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-8">
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Solution</FormLabel>
              <FormDescription>
                Include solution for this question
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={hasSolution}
                onCheckedChange={setHasSolution}
              />
            </FormControl>
          </FormItem>
          {hasSolution && (
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Used</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {hasSolution && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution Code</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your code here."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">Add Question</Button>
        </form>
      </Form>
    </div>
  );
}
