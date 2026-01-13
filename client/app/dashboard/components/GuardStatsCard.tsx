"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/store/useDashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleTextColor } from "@/lib/roleColors";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, ArrowUpDown, PlusCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewVisitorForm from "./NewVisitorForm";
// import { useEffect, useState } from "react";

type GuardMetricsProps = {
  stats: DashboardStats | null;
};

// const GuardMetrics = ({ stats }: GuardMetricsProps) => {
const GuardMetrics = () => {
  const user = useDashboardStore((state) => state.user);
  //   if (!stats) {
  //     return (
  //       <div className="grid grid-cols-2 gap-4">
  //         <Skeleton className="h-24" />
  //         <Skeleton className="h-24" />
  //       </div>
  //     );
  //   }

  const metrics = [
    { label: "Total Visitors", value: 20 },
    { label: "Present", value: 10 },
    { label: "Departed", value: 10 },
  ];

  type Visitor = {
    name: string;
    phone: number;
    checkInTime: string;
    checkOutTime: string | null;
    status: string | null;
  };

  const visitors = [
    {
      name: "Alice Johnson",
      phone: 1234567890,
      checkInTime: "2024-10-01T09:00:00Z",
      checkOutTime: null,
      status: "arrived",
    },
    {
      name: "Bob Smith",
      phone: 2345678901,
      checkInTime: "2024-10-01T10:30:00Z",
      checkOutTime: "2024-10-01T12:00:00Z",
      status: "departed",
    },
    {
      name: "Charlie Brown",
      phone: 3456789012,
      checkInTime: "2024-10-01T11:15:00Z",
      checkOutTime: null,
      status: "arrived",
    },
    {
      name: "Diana Prince",
      phone: 4567890123,
      checkInTime: "2024-10-01T08:45:00Z",
      checkOutTime: "2024-10-01T11:30:00Z",
      status: "departed",
    },
    {
      name: "Ethan Hunt",
      phone: 5678901234,
      checkInTime: "2024-10-01T09:30:00Z",
      checkOutTime: null,
      status: "arrived",
    },
  ];

  //   table column definition
  const columns: ColumnDef<Visitor>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "checkInTime",
      header: () => <div className="text-center">Check-In Time</div>,
      cell: ({ row }) => {
        const value = row.getValue("checkInTime") as string;
        const date = new Date(value);
        const formatted = isNaN(date.getTime())
          ? "-"
          : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return <div className="text-center">{formatted}</div>;
      },
    },
    {
      accessorKey: "checkOutTime",
      header: () => <div className="text-center">Check-Out Time</div>,
      cell: ({ row }) => {
        const value = row.getValue("checkOutTime") as string;
        const date = new Date(value);
        const formatted = isNaN(date.getTime())
          ? "-"
          : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return <div className="text-center">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const visitor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="uppercase">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(visitor.name)}
              >
                Copy visitor name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mark as departed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const [isVisitorOpen, setIsVisitorOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const table = useReactTable({
    data: visitors,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, globalFilter },
    globalFilterFn: (row, columnId, filterValue) => {
      // filter by name, phone, or status
      const { name, phone, status } = row.original;
      const search = filterValue.toLowerCase();
      return (
        name.toLowerCase().includes(search) ||
        phone.toString().includes(search) ||
        (status ? status?.toLowerCase().includes(search) : false)
      );
    },
  });

  return (
    <div className="gap-4 w-full h-1/4">
      <div className="rounded-lg h-full gap-4 flex items-center justify-between">
        {metrics.map((metric, i) => (
          <Card className="flex justify-center text-center w-full" key={i}>
            <CardContent>
              <div
                className={`${getRoleTextColor(user?.role)} text-3xl font-bold`}
              >
                {metric.value}
              </div>
              <div className="text-lg text-slate-800">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* {metrics.slice(2,4).map((metric, i) => (
      <div className="rounded-lg h-full space-y-4">
          <Card className="flex justify-center text-center" key={i}>
            <CardContent>
              <div className={`${getRoleTextColor(user?.role)} text-3xl font-bold`}>{metric.value}</div>
              <div className="text-lg text-slate-800">{metric.label}</div>
            </CardContent>
          </Card>
        
      </div>
        ))} */}

      {/* TABULATED LIST OF VISITORS */}
      <div className="mt-8">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search visitors..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                table.setGlobalFilter(value);
              }, 500);
            }}
            className="max-w-sm"
          />
              <Button onClick={() => alert('Clicked!')} className="cursor-pointer">
                {" "}
                <PlusCircle /> Create New Visitor
              </Button>
          
        </div>
        <div className="overflow-hidden rounded-lg border max-w-6xl p-3 bg-white shadow-sm">
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
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {/* <Card className="flex justify-center items-center mt-8">
          <CardContent>
          </CardContent>
      </Card> */}
    </div>
  );
};

export default GuardMetrics;
