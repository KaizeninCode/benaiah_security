"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/store/useDashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleTextColor, roleColors } from "@/lib/roleColors";
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

import { Table } from "@chakra-ui/react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewVisitorForm from "./NewVisitorForm";
// import { useEffect, useState } from "react";

type GuardMetricsProps = {
  stats: DashboardStats | null;
};

// const GuardMetrics = ({ stats }: GuardMetricsProps) => {
const GuardStatsCard = () => {
  const user = useDashboardStore((state) => state.user);
  

  const metrics = [
    { label: "Total Visitors", value: 20 },
    { label: "Present", value: 10 },
    { label: "Departed", value: 10 },
  ];


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

  
  const [isVisitorOpen, setIsVisitorOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter visitors based on filter state
  const filteredVisitors = visitors.filter((visitor) => {
    const search = filter.toLowerCase();
    return (
      visitor.name.toLowerCase().includes(search) ||
      visitor.phone.toString().includes(search) ||
      (visitor.status ? visitor.status.toLowerCase().includes(search) : false)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVisitors.length / pageSize) || 1;
  const paginatedVisitors = filteredVisitors.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
      <div className="mt-8 h-3/4">
              <div className="flex items-center justify-between py-4">
                <Input
                  placeholder="Search sites..."
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="max-w-sm"
                />
                {/* NEW VISITOR BUTTON AND DIALOG */}
                <Dialog open={isVisitorOpen} onOpenChange={setIsVisitorOpen}>
                  <DialogTrigger asChild>
                    <Button className={`${roleColors[user?.role as keyof typeof roleColors] } cursor-pointer`}>
                      <PlusCircle /> Create New Visitor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle className="text-center">
                      Create New Visitor
                    </DialogTitle>
                    <NewVisitorForm onSuccess={() => setIsVisitorOpen(false)} />
                    <DialogDescription></DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-hidden rounded-lg border max-w-6xl p-3 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-In Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-Out Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVisitors.length ? (
                      paginatedVisitors.map((visitor, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visitor.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visitor.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visitor.checkInTime
                              ? new Date(visitor.checkInTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visitor.checkOutTime
                              ? new Date(visitor.checkOutTime).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visitor.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Edit</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Delete</DropdownMenuLabel>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="h-24 text-center">
                          No results.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm px-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
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

export default  GuardStatsCard;