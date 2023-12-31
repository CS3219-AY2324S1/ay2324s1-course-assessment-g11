import { ColumnDef } from "@tanstack/react-table";
import { TypographySmall } from "../ui/typography";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { EditIcon, PlayIcon, ArrowUpDown } from "lucide-react";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { getDifficultyColor } from "../common/difficulty-selector";

export const getColumnDefs: (isEditable: boolean) => ColumnDef<Question>[] = isEditable => [
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
    accessorKey: "topics",
    header: "Topics",
    cell: ({ row }) => {
      const topics = row.getValue("topics") as string[];
      return (
        <div className="flex gap-2 flex-wrap">
          {topics.map((topic) => (
            <Badge variant="outline" className="" key={topic}>
              <TypographySmall>{topic}</TypographySmall>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const questionId = row.original.id;
      return (
        <div className="flex gap-2 justify-between">
          {isEditable &&
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => {
              window.location.href = `/questions/${questionId}/edit`;
            }}>
              <EditIcon size={20} />
            </Button>}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={() => {
              window.location.href = `/questions/${questionId}`;
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
