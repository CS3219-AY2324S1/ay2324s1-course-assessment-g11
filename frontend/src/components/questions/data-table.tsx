import { useContext, useMemo, useRef, useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "../../pages/api/questionHandler";
import { AuthContext } from "../../contexts/AuthContext";
import { User } from "firebase/auth";


import { DotWave } from '@uiball/loaders'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  isEditable?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  isEditable = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { user: currentUser, authIsReady } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const maxPage = useRef({maxFetchedPage: -1, isMax: false});

  const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const [searchTitle, setSearchTitle] = useState("");

  const fetchDataOptions = {
    pageIndex,
    pageSize,
    searchTitle,
    uid: currentUser?.uid ?? null,
  };

  const dataQuery = useQuery({
    queryKey: ["questions", fetchDataOptions],
    queryFn: async ({queryKey}) => {
      const {uid, pageIndex, pageSize, searchTitle} = queryKey[1] as typeof fetchDataOptions;
      if (!uid) throw new Error("Unauthenticated user");
      setLoading(true);
      let conditions = {};
      if (isEditable) {
        conditions = {"author": uid};
      }
      if (searchTitle) {
        conditions = {...conditions, "searchTitle": searchTitle};
      }
      const response = await fetchQuestions(currentUser, pageIndex, pageSize, conditions);
      setLoading(false)
      if (pageIndex > maxPage.current.maxFetchedPage) {
        maxPage.current.maxFetchedPage = pageIndex;
        maxPage.current.isMax = !response.hasNextPage;
      }
      console.log("fetched response", response)
      return response.questions as TData[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const defaultData = useMemo(() => [], []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data: dataQuery.data ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: maxPage.current.isMax ? maxPage.current.maxFetchedPage + 1 : -1,
  });

  

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="flex items-left w-full space-x-2">
          <Input
            placeholder="Search questions..."
            defaultValue={searchTitle}
            // onChange={(event) => setSearchTitle(event.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setSearchTitle((e.target as EventTarget & HTMLInputElement).value);
              }
            }}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="ml-auto">
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.id === "difficulty")
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      // checked={column.getIsVisible()}
                      // onCheckedChange={(value) =>
                      //   column.toggleVisibility(!!value)
                      // }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="ml-auto">
              Show/Hide
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <DotWave
              size={47}
              speed={1}
              color="white"
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 pr-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
