import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import DifficultySelector from "../common/difficulty-selector";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useReducer } from "react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

export const formSchema = z.object({
  title: z.string().min(2).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  description: z.string().min(2).max(10000),
  category: z.string().min(2).max(100),
})

interface QuestionsFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: any;
  onDelete?: any;
  type?: "add" | "edit";
  loading?: boolean;
}

export default function QuestionsForm({
  form,
  onSubmit,
  onDelete = () => {},
  type = "add",
  loading = false,
}: QuestionsFormProps) {
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Category</FormLabel>
              <FormControl>
                <Input placeholder="eg. Dynamic Programming" {...field} />
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
                <DifficultySelector
                  onChange={(value) =>
                    form.setValue("difficulty", value != "any" ? value : "easy")
                  }
                  showAny={false}
                  value={form.getValues().difficulty}
                />
              </FormControl>
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
                  placeholder="Write your question here in markdown format. Your question may be sanitized to remove harmful HTML tags."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type == "add" ? (
          <Button type="submit" disabled={loading}>
            Add Question
          </Button>
        ) : (
          <div className="flex gap-x-6">
            <Button type="submit" disabled={loading} onClick={e => {
            e.stopPropagation(); e.preventDefault();
            onSubmit(form.getValues());
            }}>Save Changes</Button>
            <Button
              variant="outline"
              className="border-destructive text-destructive"
              disabled={loading}
              onClick={onDelete}
            >
              Delete Question
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
