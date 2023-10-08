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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

interface QuestionsFormProps {
  form: any;
  onSubmit: any;
  type?: 'add' | 'edit';
}

export default function QuestionsForm({ form, onSubmit, type = 'add' }: QuestionsFormProps) {
  const [hasSolution, setHasSolution] = useState(false);

  useEffect(() => {
    if (form.getValues().code != "") {
      setHasSolution(true);
    }
  }, [form.getValues().code]);

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
  ];

  const toggleSolution = (hasSolution: boolean) => {
    setHasSolution(hasSolution)
    if (!hasSolution) {
      form.setValue('language', '')
      form.setValue('code', '')
    }
  }

  return (
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
              onCheckedChange={toggleSolution}
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
                    <SelectTrigger >
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
                  {/* TODO: Change to code editor later */}
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
        {type == 'add'
          ? (
            <Button type="submit">Add Question</Button>
          )
          : (
            <div className="flex gap-x-6">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" className="border-destructive text-destructive">Delete Question</Button>
            </div>
          )}

      </form>
    </Form>
  );
}