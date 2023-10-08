import { TypographyBodyHeavy, TypographyH1, TypographyH2, TypographySmall } from '@/components/ui/typography'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useState } from 'react';
import DifficultySelector from '@/components/common/difficulty-selector';

type Difficulty = 'easy' | 'medium' | 'hard' | 'any';

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
];

export default function Interviews() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  return (
    <div className='min-h-screen p-12 mx-auto max-w-7xl'>

      <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
        Interviews
      </TypographyH1>

      <TypographyBodyHeavy>
        Try out mock interviews with your peers!
      </TypographyBodyHeavy>

      <div className='flex-col flex gap-4 mt-12'>
        <TypographyH2 className="text-primary">
          Quick Match
        </TypographyH2>
        <div>
          <TypographySmall>Choose question difficulty</TypographySmall>
          <DifficultySelector onChange={(value) => setDifficulty(value)} showAny={true} defaultValue={difficulty} />
        </div>

        <div>
          <TypographySmall>Choose programming language</TypographySmall>
          <div className="pt-3 pb-10">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[240px] justify-between"
                >
                  {value
                    ? frameworks.find((framework) => framework.value === value)
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
                    {frameworks.map((framework) => (
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
                            value === framework.value
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
        </div>
      </div>

      <Link href="interviews/1/find-match"><Button variant={"default"}>Practice with a peer!</Button></Link>
    </div>
  )
}
