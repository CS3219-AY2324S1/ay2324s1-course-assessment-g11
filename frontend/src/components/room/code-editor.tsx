import * as React from "react"
import { Check, ChevronsUpDown, Undo, Redo, Settings } from "lucide-react"
import Editor from '@monaco-editor/react';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type CodeEditorProps = {
  theme?: string
  language?: string
  height?: string
  defaultValue?: string
  className?: string
}

const frameworks = [
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
]

export default function CodeEditor({
  theme = 'vs-dark',
  language = 'python',
  height = '60vh',
  defaultValue = '#Write your solution here', className }: CodeEditorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <div className={className}>
      <div className="mb-2 flex justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[240px] justify-between"
            >
              {value
                ? frameworks.find((framework) => framework.value === value)?.label
                : "Select framework..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex flex-row gap-2 justify-end">
          <Button variant="secondary" size="icon"><Undo /></Button>
          <Button variant="secondary" size="icon"><Redo /></Button>
          <Button variant="secondary" size="icon"><Settings /></Button>
        </div>
      </div>
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={defaultValue}
        theme={theme}
      />
    </div>
  )
}
