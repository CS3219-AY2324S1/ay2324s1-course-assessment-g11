import { Button } from "../ui/button";

type Difficulty = "easy" | "medium" | "hard" | "any";

interface DifficultySelectorProps {
  onChange: (value: Difficulty) => void;
  showAny: boolean;
  value: Difficulty;
  isLoading?: boolean;
}

export default function DifficultySelector({
  onChange,
  showAny,
  value,
  isLoading = false,
}: DifficultySelectorProps) {
  const difficulties = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ];

  if (showAny) {
    difficulties.push({ label: "Any", value: "any" });
  }

  return (
    <div className="mt-2 mb-6 flex gap-2 bg-popover w-min rounded-lg">
      {difficulties.map((difficulty) => (
        <Button
          disabled={isLoading}
          key={difficulty.value}
          className="w-32"
          variant={value == difficulty.value ? "outline" : "secondary"}
          value={difficulty.value}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(e.currentTarget.value as Difficulty);
          }}
        >
          {difficulty.label}
        </Button>
      ))}
    </div>
  );
}
