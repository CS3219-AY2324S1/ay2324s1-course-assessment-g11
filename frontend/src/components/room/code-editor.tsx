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
  onSubmitClick?: (param: string, solved: boolean) => void;
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
  height = "70vh",
  defaultValue = "#Write your solution here",
  className,
  text,
  cursor,
  onChange,
  onCursorChange,
  hasRoom = true,
  onSubmitClick = () => {},
  onLeaveRoomClick = () => {},
}: CodeEditorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [frameWork, setFrameWork] = React.useState(language); // default to python
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
      console.log(cursor);
      setCursorPosition(cursor);
    }

    monacoInstance?.onDidChangeCursorPosition((e) => {
      if (onCursorChange === undefined) return;
      const cursor = monacoInstance
        .getModel()!
        .getOffsetAt(monacoInstance.getPosition()!);
      onCursorChange(cursor);
    });
  }, [text, cursor, setCursorPosition, monacoInstance, onCursorChange]);

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

  const handleOnSubmitClick = async (solved: boolean) => {
    if (isSubmitting) {
      return; // Do nothing if a submission is already in progress.
    }
    setIsSubmitting(true);
    try {
      onSubmitClick(monacoInstance?.getValue() ?? value, solved);
    } catch (error) {
      console.log(error);
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
              {frameWork
                ? languages.find((framework) => framework.value === frameWork)
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
                      setFrameWork(
                        currentValue === frameWork ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        frameWork === framework.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Editor
        key={frameWork}
        height={height}
        defaultLanguage={frameWork === "c++" ? "cpp" : frameWork}
        defaultValue={defaultValue}
        value={text}
        theme={theme}
        onChange={(e) => editorOnChange(e)}
        onMount={editorMount}
      />
      <Card className="flex-1 p-2 mt-2">
        <div className="flex justify-end gap-2">
          {hasRoom ? (
            <Button variant="default" onClick={onLeaveRoomClick}>
              Leave Room
            </Button>
          ) : (
            <div className="flex flex-row space-x-4">
              <Button
                size={"sm"}
                variant="secondary"
                onClick={() => handleOnSubmitClick(false)}
                disabled={isSubmitting}
              >
                Submit as Unsolved
              </Button>
              <Button
                size={"sm"}
                variant="default"
                onClick={() => handleOnSubmitClick(true)}
                disabled={isSubmitting}
              >
                Submit as Solved
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
