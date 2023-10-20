import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DifficultySelector from "@/components/common/difficulty-selector";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

export const formSchema = z.object({
  title: z.string().min(2).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topics: z.array(z.string().min(2).max(100)),
  description: z.string().min(2).max(10000),
  testCasesInputs: z.array(z.string().min(2).max(10000)),
  testCasesOutputs: z.array(z.string().min(2).max(10000)),
  defaultCode: z.object({
    "python": z.string().min(0).max(10000),
    "java": z.string().min(0).max(10000),
    "c++": z.string().min(0).max(10000)
  }) || undefined,
})


const defaultCodes = {
  'python': `def twoSum(self, nums: list[int], target: int) -> list[int]:
pass

if __name__ == "__main__":
size = int(input())
nums = list(map(int, input().split()))
target = int(input())
print(" ".join(twoSum(nums, target)))`,

'java': `import java.util.*;

class Solution {
  public int[] twoSum(int[] nums, int target) {
    // TODO: Write your code here
  }
  
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int size = sc.nextInt();
    int[] nums = new int[size];
    for (int i = 0; i < size; i++) {
      nums[i] = sc.nextInt();
    }
    int target = sc.nextInt();
    Solution solution = new Solution();
    int[] result = solution.twoSum(nums, target);
    System.out.println(result[0] + " " + result[1]);
  }
}`,

'c++': `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
  vector<int> twoSum(vector<int>& nums, int target) {
    // TODO: Write your code here
  }
};

int main() {
  int size;
  cin >> size;
  vector<int> nums(size);
  for (int i = 0; i < size; i++) {
    cin >> nums[i];
  }
  int target;
  cin >> target;
  Solution solution;
  vector<int> result = solution.twoSum(nums, target);
  cout << result[0] << " " << result[1] << endl;
  return 0;
}`
};


interface QuestionsFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: any;
  type?: "add" | "edit";
  loading?: boolean;
}

export default function QuestionsForm({
  form,
  onSubmit,
  type = "add",
  loading = false,
}: QuestionsFormProps) {
  const [testCases, setTestCases] = useState<{input: string, output: string}[]>([]);

  const createTopic = (label: string) => ({ value: label.toLowerCase(), label });

  const topics = ["Algorithms", "Arrays", "Bit Manipulation", "Brainteaser", "Data Structures", "Databases", "Graph", "Recursion", "Strings"].map(createTopic);

  useEffect(() => {
    form.setValue('testCasesInputs', testCases.map(testCase => testCase.input));
    form.setValue('testCasesOutputs', testCases.map(testCase => testCase.output));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCases]);

  useEffect(() => {
    form.setValue('defaultCode', defaultCodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <DifficultySelector
                  onChange={(value) =>
                    form.setValue("difficulty", value != "any" ? value : "easy")
                  }
                  showAny={false}
                  defaultValue={form.getValues().difficulty}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select topics</FormLabel>
              <MultiSelect
                selected={field.value}
                options={topics}
                className="sm:w-[510px]"
                onChange={field.onChange}
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
                  placeholder="Write your question here in markdown format. Your question may be sanitized to remove harmful HTML tags."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>Test cases</p>
        {testCases.map((testCase, index) => {
          return <div className="flex flex-row items-center justify-between gap-0.5" key={`testCase-${index}`}>
            <Textarea placeholder="Input" value={testCase.input} onChange={(e) => {
              testCase.input = e.target.value;
              setTestCases(testCases => [...testCases]);
            }} />
            <Textarea placeholder="Output" value={testCase.output} onChange={(e) => {
              testCase.output = e.target.value;
              setTestCases(testCases => [...testCases]);
            }} />
            <Button variant="outline" className="border-destructive text-destructive" onClick={() => {
              setTestCases(testCases => testCases.filter((_, i) => i != index))
            }}>Delete</Button>
          </div>
        })}
        <div className="flex gap-x-4">
          <Button variant="outline" className="border-primary text-primary" onClick={() => setTestCases(testCases => [...testCases, {input: '', output: ''}])}>Add Test Case</Button>
          <Button variant="outline" className="border-destructive text-destructive" onClick={() => setTestCases([])}>Clear Test Cases</Button>
        </div>
        <FormField
          control={form.control}
          name="defaultCode.c++"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default C++ Code (TODO: Change to Code Editor)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your code here."
                  className="resize-none"
                  {...field}
                  value={field.value || defaultCodes["c++"]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultCode.java"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Java Code</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your code here."
                  className="resize-none"
                  {...field}
                  value={field.value || defaultCodes["java"]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultCode.python"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Python Code</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your code here."
                  className="resize-none"
                  {...field}
                  value={field.value || defaultCodes["python"]}
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
            <Button type="submit" disabled={loading}>Save Changes</Button>
            <Button
              variant="outline"
              className="border-destructive text-destructive"
              disabled={loading}
            >
              Delete Question
            </Button>
          </div>
        )}

      </form>
    </Form>
  );
}
