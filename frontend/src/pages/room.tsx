import CodeEditor from "@/components/code-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Room() {
  return (
    <div className='min-h-screen p-12'>
      <div className="flex">
      <Tabs defaultValue="description flex-1">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
        </TabsList>
        <TabsContent value="description">Description</TabsContent>
        <TabsContent value="solution">Solution</TabsContent>
      </Tabs>
      <CodeEditor className="flex-1"/>
      </div>
    </div>
  )
}
