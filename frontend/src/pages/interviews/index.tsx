import DifficultySelector from "@/components/common/difficulty-selector";
import { columns, PublicUser } from "@/components/interviews/leaderboard/columns";
import { DataTable } from "@/components/interviews/leaderboard/data-table";
import { languages } from "@/components/room/code-editor";
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
import {
  TypographyBodyHeavy,
  TypographyH1,
  TypographyH2,
  TypographySmall,
} from "@/components/ui/typography";
import { AuthContext } from "@/contexts/AuthContext";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

type Difficulty = "easy" | "medium" | "hard" | "any";

type LeaderboardUser = {
  uid: string;
  displayName: string;
  photoURL: string;
  attempts: number;
};

export default function Interviews() {
  const { user: currentUser } = useContext(AuthContext);

  const router = useRouter();
  const { joinQueue } = useMatchmaking();
  const { fetchLeaderboard } = useLeaderboard();
  const { getAppUser } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.length > 0 ? languages[0].value : "c++"
  );
  const [leaderboardData, setLeaderboardData] = useState<Array<PublicUser>>([]);

  useEffect(() => {
    if (currentUser) {
      getAppUser().then((user) => {
        if (user) {
          setDifficulty((user.matchDifficulty as Difficulty) || difficulty);
          setSelectedLanguage(
            user.matchProgrammingLanguage || selectedLanguage
          );
        }
        setIsLoading(false);
      });
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    fetchLeaderboard().then((data) => {
      setLeaderboardData(data as Array<PublicUser>);
    });
  }, [])

  const onClickSearch = () => {
    try {
      joinQueue(
        difficulty === "any" ? ["easy", "medium", "hard"] : [difficulty],
        selectedLanguage
      );
      console.log("Joined queue");
      router.push(`/interviews/find-match`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-12 mx-auto max-w-7xl">
      <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
        Interviews
      </TypographyH1>

      <TypographyBodyHeavy>
        Try out mock interviews with your peers!
      </TypographyBodyHeavy>

      <div className="flex justify-between">
        <div className="flex-col flex gap-4 mt-12">
          <TypographyH2 className="text-primary">Quick Match</TypographyH2>
          <div>
            <TypographySmall>Choose question difficulty</TypographySmall>
            <DifficultySelector
              onChange={(value) => setDifficulty(value)}
              showAny={true}
              value={difficulty}
              isLoading={isLoading}
            />
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
                    {selectedLanguage
                      ? languages.find(
                          (language) => language.value === selectedLanguage
                        )?.label
                      : "Select Language..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={
                        languages.length > 0
                          ? languages[0].label
                          : "Search Language..."
                      }
                    />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          key={language.value}
                          onSelect={(currentValue) => {
                            setSelectedLanguage(
                              currentValue === selectedLanguage
                                ? ""
                                : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedLanguage === language.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button
            onClick={onClickSearch}
            variant={"default"}
            className="w-fit px-6"
          >
            Practice with a peer!
          </Button>
        </div>
        <div className="flex-col flex gap-4">
          <TypographyH2 className="text-primary">Leaderboard</TypographyH2>
          <DataTable columns={columns} data={leaderboardData} />
          <div></div>
        </div>
      </div>
    </div>
  );
}
