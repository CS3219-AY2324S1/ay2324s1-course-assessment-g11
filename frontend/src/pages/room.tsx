import CodeEditor from "@/components/room/code-editor"
import Description from "@/components/room/description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyBody } from "@/components/ui/typography";

type Question = {
  title: string;
  difficulty: string;
  tags: string[];
  description: string;
  solution: string;
}

export default function Room() {
  const question: Question = {
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    solution: 'var twoSum = function(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n};'
  }
  
  return (
    <div className='h-[calc(100vh-80px)] p-12'>
      <div className="flex h-full">
        <Tabs defaultValue="description" className="flex-1">
          <TabsList>
            <TabsTrigger value="description">
              <TypographyBody>Description</TypographyBody>
            </TabsTrigger>
            <TabsTrigger value="solution">
              <TypographyBody>Solution</TypographyBody>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="h-full">
            <Description question={question} participants={["Charisma", "Chun Wei"]} className="h-full"/>
          </TabsContent>
          <TabsContent value="solution">Solution</TabsContent>
        </Tabs>
        <div className="flex-1">

          <CodeEditor />
        </div>
      </div>
    </div>
  )
}
