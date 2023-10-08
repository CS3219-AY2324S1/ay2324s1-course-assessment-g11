import { ColumnDef } from "@tanstack/react-table";
import { TypographySmall } from "../ui/typography";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { EditIcon, PlayIcon, ArrowUpDown } from "lucide-react";
import { Difficulty, QuestionColumns } from "../../../types/QuestionTypes";

export const columns: ColumnDef<QuestionColumns>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as Difficulty;
      return (
        <Badge variant="secondary" className="h-min">
          <TypographySmall className={`${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </TypographySmall>
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
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <Badge variant="outline" className="" key={tag}>
              <TypographySmall>{tag}</TypographySmall>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const questionId = row.getValue("title") as string;
      return (
        <div className="flex gap-2 justify-between">
          <Button variant="secondary" size="icon" className="h-8 w-8">
            <EditIcon size={20} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={() => {
              window.location.href = `/questions/${questionId
                .split(" ")
                .join("-")}`;
            }}
          >
            Practice
            <PlayIcon size={20} />
          </Button>
        </div>
      );
    },
    enableHiding: false,
  },
];

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
};
