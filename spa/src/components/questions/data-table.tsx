import { useMemo, useRef, useState } from "react";

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
} from "../ui/table";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { DotWave } from '@uiball/loaders'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  isEditable?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  isEditable = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([{"id": "title", "desc": false}]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [loading, setLoading] = useState(false);

  const maxPage = useRef({maxFetchedPage: -1, isMax: false});

  const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const [searchTitle, setSearchTitle] = useState("");
  const [filteredDifficulty, setFilteredDifficulty] = useState({"easy": true, "medium": true, "hard": true});
  const [localFilteredDifficulty, setLocalFilteredDifficulty] = useState({"easy": true, "medium": true, "hard": true});

  const defaultData = useMemo(() => [], []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data: defaultData,
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
    manualSorting: true,
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
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setSearchTitle((e.target as EventTarget & HTMLInputElement).value);
                // reset pagination
                setPagination({pageIndex: 0, pageSize: 10});
                maxPage.current = {maxFetchedPage: -1, isMax: false};
              }
            }}
            className="max-w-sm"
          />
          <DropdownMenu onOpenChange={open => {
            if (!open) {
              if (JSON.stringify(localFilteredDifficulty) !== JSON.stringify(filteredDifficulty)) {
                setFilteredDifficulty(localFilteredDifficulty);
                // reset pagination
                setPagination({pageIndex: 0, pageSize: 10});
                maxPage.current = {maxFetchedPage: -1, isMax: false};
              }
            }
          }}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="ml-auto">
                Filter by difficulty
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["easy", "medium", "hard"]
                .map((difficulty) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={difficulty}
                      className="capitalize"
                      checked={(localFilteredDifficulty as any)[difficulty]}
                      onCheckedChange={(value) =>
                        setLocalFilteredDifficulty(prevValue => {
                          const newValue = {...prevValue};
                          (newValue as any)[difficulty] = !!value;
                          return newValue;
                        })
                      }
                      onSelect={e => e.preventDefault()}
                    >
                      {difficulty}
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
    </div>
  );
}
