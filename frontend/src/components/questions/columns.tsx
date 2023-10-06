import { ColumnDef } from "@tanstack/react-table"
import { TypographySmall } from "../ui/typography";
import { Badge } from "../ui/badge";

type Difficulty = 'easy' | 'medium' | 'hard' | 'any';

export type Question = {
  title: string;
  difficulty: Difficulty;
  tags: string[];
}

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as Difficulty;
      return (
        <Badge variant="secondary" className="h-min">
          <TypographySmall className={`${getDifficultyColor(difficulty)}`}>{difficulty}</TypographySmall>
        </Badge>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Topics",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="flex gap-2">
          {tags.map((tag) => (
            <Badge variant="outline" className="" key={tag}>
              <TypographySmall>{tag}</TypographySmall>
            </Badge>
          ))}
        </div>
      );
    },
  },
]

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "text-green-500";
    case "medium":
      return "text-orange-500";
    case "hard":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}