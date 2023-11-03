import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Undo,
  Redo,
  Settings,
  Play,
} from "lucide-react";
import Editor, { OnMount } from "@monaco-editor/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "../ui/card";
import { TypographyBody, TypographyBodyHeavy } from "../ui/typography";
import { editor } from "monaco-editor";

type CodeEditorProps = {
  theme?: string;
  language?: string;
  height?: string;
  defaultValue?: string;
  className?: string;
  text: string;
  cursor?: number;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onCursorChange?: React.Dispatch<React.SetStateAction<number>>;
  hasRoom?: boolean;
  onSubmitClick?: () => void;
  onLeaveRoomClick?: () => void;
};

export const languages = [
  {
    value: "python",
    label: "python",
  },
  {
    value: "java",
    label: "java",
  },
  {
    value: "c++",
    label: "c++",
  },
];

export default function CodeEditor({
  theme = "vs-dark",
  language = "python",
  height = "60vh",
  defaultValue = "#Write your solution here",
  className,
  text,
  cursor,
  onChange,
  onCursorChange,
  hasRoom = true,
  onSubmitClick = (value) => {},
  onLeaveRoomClick = () => {},
}: CodeEditorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [monacoInstance, setMonacoInstance] =
    React.useState<editor.IStandaloneCodeEditor | null>(null);

  const editorMount: OnMount = (editorL: editor.IStandaloneCodeEditor) => {
    setMonacoInstance(editorL);
  };

  const setCursorPosition = React.useCallback(
    (cursor: number) => {
      if (!monacoInstance) return;

      const position = monacoInstance.getModel()!.getPositionAt(cursor);
      monacoInstance.setPosition(position);
    },
    [monacoInstance]
  );

  React.useEffect(() => {
    if (cursor !== undefined) {
      setCursorPosition(cursor);
    }
  }, [cursor, setCursorPosition]);

  const editorOnChange = React.useCallback(
    (value: string | undefined) => {
      if (!monacoInstance) return;
      if (value === undefined) return;
      if (onCursorChange === undefined) return;

      if (monacoInstance.getPosition()) {
        const cursor = monacoInstance
          .getModel()!
          .getOffsetAt(monacoInstance.getPosition()!);
        onCursorChange(cursor);
      }
      onChange(value);
    },
    [onChange, onCursorChange, monacoInstance]
  );

  const handleOnSubmitClick = async () => {
    if (isSubmitting) {
      return; // Do nothing if a submission is already in progress.
    }
    setIsSubmitting(true);
    try {
      onChange(value);
      onSubmitClick(value);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                ? languages.find((framework) => framework.value === value)
                    ?.label
                : "Select framework..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {languages.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
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
          <Button variant="secondary" size="icon">
            <Undo />
          </Button>
          <Button variant="secondary" size="icon">
            <Redo />
          </Button>
          <Button variant="secondary" size="icon">
            <Settings />
          </Button>
        </div>
      </div>
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={defaultValue}
        value={text}
        theme={theme}
        onChange={(e) => editorOnChange(e)}
        onMount={editorMount}
      />
      <Card className="flex-1 p-2 mt-2">
        <div className="h-[9vh] p-2">
          <TypographyBodyHeavy>Console</TypographyBodyHeavy>
        </div>
        <div className="flex justify-end gap-2">
          {/* <Button variant="outline">
              <Play className="mr-1" />
              Run
            </Button> */}
          {hasRoom ? (
            <Button variant="default" onClick={onLeaveRoomClick}>
              Leave Room
            </Button>
          ) : (
            <Button variant="default" onClick={handleOnSubmitClick}>
              Submit
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
