import {
  TypographyBodyHeavy,
  TypographyH1,
  TypographyH2,
} from "@/components/ui/typography";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getColumnDefs } from "@/components/questions/columns";
import { DataTable } from "@/components/questions/data-table";
import { PlusIcon } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Questions() {
  const queryClientAll = new QueryClient();

  return (
    <div className="min-h-screen p-12 mx-auto max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <TypographyH1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary w-min mb-1">
            Questions
          </TypographyH1>
          <TypographyBodyHeavy>
            Practice our questions to ace your coding interview!
          </TypographyBodyHeavy>
        </div>
        <Link href="/questions/new">
          <Button className="gap-2">
            <PlusIcon />
            Contribute question
          </Button>
        </Link>
      </div>

      <div className="flex-col flex gap-4 py-12">
        <TypographyH2 className="text-primary">All Questions</TypographyH2>
        <QueryClientProvider client={queryClientAll}>
          <DataTable columns={getColumnDefs(true)} />
        </QueryClientProvider>
      </div>
    </div>
  );
}
